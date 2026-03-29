import { betterAuth } from "better-auth";
import { nanoid } from 'nanoid';
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { getBaseURL } from '@/lib/get-base-url';
import * as schema from '@/db/schemas/auth';
import { anonymous, genericOAuth } from "better-auth/plugins";
import { stripe as stripePlugin } from "@better-auth/stripe";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { sendPasswordResetEmail, sendPaymentCompletedNotificationEmail } from "@/lib/email";
import { members } from "@/db/schemas/member";

// Stripe クライアントを初期化
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const auth = betterAuth({
	baseURL: getBaseURL(),
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
      schema
  }),
  advanced: {
    database: {
      generateId: () => nanoid(10),
    },
  },
  emailAndPassword: {
    enabled: true, // メール＋パスワード認証を有効化
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        email: user.email,
        resetLink: url,
      });
    },
  },
  account: {
    // 同じメールアドレスの既存アカウントにソーシャルログインを自動リンク
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "line"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "select_account",
    },
    // LINEは genericOAuth プラグインで設定（bot_prompt パラメータをサポートするため）
  },
  plugins: [
    anonymous(),
    nextCookies(),
    // LINE を genericOAuth で設定（bot_prompt パラメータをサポート）
    genericOAuth({
      config: [
        {
          providerId: "line",
          clientId: process.env.LINE_CLIENT_ID!,
          clientSecret: process.env.LINE_CLIENT_SECRET!,
          discoveryUrl: undefined,
          authorizationUrl: "https://access.line.me/oauth2/v2.1/authorize",
          tokenUrl: "https://api.line.me/oauth2/v2.1/token",
          scopes: ["openid", "profile", "email"],
          // LINE公式アカウントの友だち追加オプションを表示
          // aggressive: 同意画面の後に確認画面を表示
          // prompt: consent で同意画面を強制表示
          authorizationUrlParams: {
            bot_prompt: "aggressive",
            prompt: "consent",
          },
          async getUserInfo(tokens) {
            const response = await fetch(
              "https://api.line.me/oauth2/v2.1/userinfo",
              {
                headers: {
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }
            );
            const userinfo = (await response.json()) as {
              sub: string;
              name?: string;
              picture?: string;
              email?: string;
            };
            return {
              id: userinfo.sub,
              name: userinfo.name,
              image: userinfo.picture,
              email: userinfo.email || `${userinfo.sub}@line.me`,
              emailVerified: !!userinfo.email,
            };
          },
        },
      ],
    }),
    stripePlugin({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: false,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "annual",
            priceId: "price_1SsFKvFyvqHGbm7Rl0qwmXjx",
          }
        ]
      },
      onEvent: async (event) => {
        console.log('[Webhook] Stripe Event:', event.type);

        try {
          if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.client_reference_id || session.metadata?.userId;
            const customerId = session.customer;
            const planId = session.metadata?.planId;
            const email = session.customer_email;
            const mode = session.mode;

            console.log('[Webhook] Session data:', JSON.stringify({ userId, customerId, planId, email, mode, subscription: session.subscription }));

            // stripeCustomerId を users テーブルに保存
            if (userId && customerId) {
              console.log('[Webhook] Updating stripeCustomerId for user:', userId);
              await db
                .update(schema.users)
                .set({ stripeCustomerId: customerId as string })
                .where(eq(schema.users.id, userId));
              console.log('[Webhook] stripeCustomerId updated successfully');
            }

            if (!userId) {
              console.error('[Webhook] No user ID found in checkout session');
              return;
            }

            console.log('[Webhook] Querying existing member for userId:', userId);
            const existingMember = await db
              .select()
              .from(members)
              .where(eq(members.userId, userId))
              .limit(1);
            console.log('[Webhook] Existing member found:', existingMember.length > 0);

            if (mode === 'subscription') {
              const subscriptionId = session.subscription as string;
              console.log('[Webhook] Retrieving subscription:', subscriptionId);
              const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
              const periodStart = subscription.items?.data?.[0]?.current_period_start
                ?? (subscription as unknown as { current_period_start?: number }).current_period_start;
              const periodEnd = subscription.items?.data?.[0]?.current_period_end
                ?? (subscription as unknown as { current_period_end?: number }).current_period_end;
              console.log('[Webhook] Subscription period:', JSON.stringify({ periodStart, periodEnd }));

              if (!periodStart || !periodEnd) {
                console.error('[Webhook] Missing period dates, using fallback (now + 1 year)');
              }
              const startDate = periodStart ? new Date(periodStart * 1000) : new Date();
              const endDate = periodEnd ? new Date(periodEnd * 1000) : (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d; })();

              if (existingMember.length === 0) {
                console.log('[Webhook] Creating new member record');
                await db.insert(members).values({
                  userId,
                  email: email || '',
                  planId: planId ? parseInt(planId) : null,
                  role: 'member',
                  status: 'pending_profile',
                  profileCompleted: false,
                  isActive: true,
                  paymentStatus: 'completed',
                  stripeSubscriptionId: subscriptionId,
                  subscriptionStartDate: startDate,
                  subscriptionEndDate: endDate,
                });
              } else {
                console.log('[Webhook] Updating existing member record');
                await db
                  .update(members)
                  .set({
                    paymentStatus: 'completed',
                    stripeSubscriptionId: subscriptionId,
                    subscriptionStartDate: startDate,
                    subscriptionEndDate: endDate,
                  })
                  .where(eq(members.userId, userId));
              }
              console.log(`[Webhook] Subscription payment completed for user: ${userId}`);

              // 決済完了通知メールを管理者に送信
              try {
                const userRecord = await db
                  .select({ name: schema.users.name })
                  .from(schema.users)
                  .where(eq(schema.users.id, userId))
                  .limit(1);
                await sendPaymentCompletedNotificationEmail({
                  name: userRecord[0]?.name || "不明",
                  email: email || "不明",
                  paymentMode: "subscription",
                });
              } catch (emailError) {
                console.error("[Webhook] Failed to send payment notification email:", emailError);
              }

            } else if (mode === 'payment') {
              const oneYearLater = new Date();
              oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

              if (existingMember.length === 0) {
                console.log('[Webhook] Creating new member record (one-time)');
                await db.insert(members).values({
                  userId,
                  email: email || '',
                  planId: planId ? parseInt(planId) : null,
                  role: 'member',
                  status: 'pending_profile',
                  profileCompleted: false,
                  isActive: true,
                  paymentStatus: 'completed',
                  stripeSubscriptionId: null,
                  subscriptionStartDate: new Date(),
                  subscriptionEndDate: oneYearLater,
                });
              } else {
                console.log('[Webhook] Updating existing member record (one-time)');
                await db
                  .update(members)
                  .set({
                    paymentStatus: 'completed',
                    stripeSubscriptionId: null,
                    subscriptionStartDate: new Date(),
                    subscriptionEndDate: oneYearLater,
                  })
                  .where(eq(members.userId, userId));
              }
              console.log(`[Webhook] One-time payment completed for user: ${userId}`);

              // 決済完了通知メールを管理者に送信
              try {
                const userRecord = await db
                  .select({ name: schema.users.name })
                  .from(schema.users)
                  .where(eq(schema.users.id, userId))
                  .limit(1);
                await sendPaymentCompletedNotificationEmail({
                  name: userRecord[0]?.name || "不明",
                  email: email || "不明",
                  paymentMode: "payment",
                });
              } catch (emailError) {
                console.error("[Webhook] Failed to send payment notification email:", emailError);
              }
            }

          } else if (event.type === 'customer.subscription.deleted') {
            const subscription = event.data.object as Stripe.Subscription;
            await db
              .update(members)
              .set({
                paymentStatus: 'canceled',
                subscriptionEndDate: new Date(),
              })
              .where(eq(members.stripeSubscriptionId, subscription.id));
            console.log(`[Webhook] Subscription canceled: ${subscription.id}`);

          } else if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object as unknown as { subscription?: string | Stripe.Subscription };
            const subscriptionValue = invoice.subscription;
            const subscriptionId = typeof subscriptionValue === 'string'
              ? subscriptionValue
              : subscriptionValue?.id;

            if (subscriptionId) {
              await db
                .update(members)
                .set({ paymentStatus: 'failed' })
                .where(eq(members.stripeSubscriptionId, subscriptionId));
              console.log(`[Webhook] Payment failed for subscription: ${subscriptionId}`);
            }
          }
        } catch (error) {
          console.error('[Webhook] onEvent error:', error);
          console.error('[Webhook] onEvent error message:', error instanceof Error ? error.message : String(error));
          console.error('[Webhook] onEvent error stack:', error instanceof Error ? error.stack : 'no stack');
          throw error;
        }
      },
    }),
  ]
});