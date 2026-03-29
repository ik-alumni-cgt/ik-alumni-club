import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { members } from "@/db/schemas/member";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.client_reference_id || session.metadata?.userId;
  const planId = session.metadata?.planId;
  const email = session.customer_email;
  const mode = session.mode; // "subscription" or "payment"

  if (!userId) {
    console.error("No user ID found in checkout session");
    return;
  }

  try {
    // 既存のmemberレコードをチェック
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.userId, userId))
      .limit(1);

    if (mode === "subscription") {
      // サブスクリプション決済の処理
      const subscriptionId = session.subscription as string;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const periodStart = subscription.items?.data?.[0]?.current_period_start
        ?? (subscription as unknown as { current_period_start?: number }).current_period_start;
      const periodEnd = subscription.items?.data?.[0]?.current_period_end
        ?? (subscription as unknown as { current_period_end?: number }).current_period_end;

      const startDate = periodStart ? new Date(periodStart * 1000) : new Date();
      const endDate = periodEnd ? new Date(periodEnd * 1000) : (() => { const d = new Date(); d.setFullYear(d.getFullYear() + 1); return d; })();

      if (existingMember.length === 0) {
        console.log(`Creating new member record for user: ${userId}`);
        await db.insert(members).values({
          userId,
          email: email || "",
          planId: planId ? parseInt(planId) : null,
          role: "member",
          status: "pending_profile",
          profileCompleted: false,
          isActive: true,
          paymentStatus: "completed",
          stripeSubscriptionId: subscriptionId,
          subscriptionStartDate: startDate,
          subscriptionEndDate: endDate,
        });
      } else {
        await db
          .update(members)
          .set({
            paymentStatus: "completed",
            stripeSubscriptionId: subscriptionId,
            subscriptionStartDate: startDate,
            subscriptionEndDate: endDate,
          })
          .where(eq(members.userId, userId));
      }

      console.log(`Subscription payment completed for user: ${userId}`);
    } else if (mode === "payment") {
      // 単発決済の処理（1年間有効）
      const oneYearLater = new Date();
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

      if (existingMember.length === 0) {
        console.log(`Creating new member record for user (one-time): ${userId}`);
        await db.insert(members).values({
          userId,
          email: email || "",
          planId: planId ? parseInt(planId) : null,
          role: "member",
          status: "pending_profile",
          profileCompleted: false,
          isActive: true,
          paymentStatus: "completed",
          stripeSubscriptionId: null,
          subscriptionStartDate: new Date(),
          subscriptionEndDate: oneYearLater,
        });
      } else {
        await db
          .update(members)
          .set({
            paymentStatus: "completed",
            stripeSubscriptionId: null,
            subscriptionStartDate: new Date(),
            subscriptionEndDate: oneYearLater,
          })
          .where(eq(members.userId, userId));
      }

      console.log(`One-time payment completed for user: ${userId}, valid until: ${oneYearLater.toISOString()}`);
    }
  } catch (error) {
    console.error("Error updating member after checkout:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  try {
    await db
      .update(members)
      .set({
        paymentStatus: "canceled",
        subscriptionEndDate: new Date(),
      })
      .where(eq(members.stripeSubscriptionId, subscriptionId));

    console.log(`Subscription canceled: ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling subscription deletion:", error);
    throw error;
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // invoiceからsubscription IDを取得（文字列またはオブジェクトの可能性がある）
  const subscriptionValue = (invoice as unknown as { subscription?: string | Stripe.Subscription }).subscription;
  const subscriptionId = typeof subscriptionValue === 'string'
    ? subscriptionValue
    : subscriptionValue?.id;

  if (!subscriptionId) {
    console.error("No subscription ID found in failed invoice");
    return;
  }

  try {
    await db
      .update(members)
      .set({
        paymentStatus: "failed",
      })
      .where(eq(members.stripeSubscriptionId, subscriptionId));

    console.log(`Payment failed for subscription: ${subscriptionId}`);
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}
