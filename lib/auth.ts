import { betterAuth } from "better-auth";
import { nanoid } from 'nanoid';
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { getBaseURL } from '@/lib/get-base-url';
import * as schema from '@/db/schemas/auth';
import { anonymous } from "better-auth/plugins";
import { stripe as stripePlugin } from "@better-auth/stripe";
import Stripe from "stripe";
import { eq } from "drizzle-orm";

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
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      prompt: "select_account",
    },
    line: {
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
    },
  },
  plugins: [
    anonymous(),
    nextCookies(),
    stripePlugin({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "annual",
            priceId: "price_1SNbQqFhSXHz6aqQCpwfWg47",
          }
        ]
      },
      onEvent: async (event) => {
        console.log('Stripe Event:', event.type, event.data.object);

        // checkout.session.completed イベントを処理
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.client_reference_id;
          const customerId = session.customer;

          console.log('Saving customer ID:', { userId, customerId });

          if (userId && customerId) {
            // データベースに保存
            await db
              .update(schema.users)
              .set({ stripeCustomerId: customerId as string })
              .where(eq(schema.users.id, userId));

            console.log('Customer ID saved successfully');
          }
        }
      },
    }),
  ]
});