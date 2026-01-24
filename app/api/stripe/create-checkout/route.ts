import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schemas/auth";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(request: NextRequest) {
  try {
    // セッション検証
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { priceId, mode = "subscription", successUrl, cancelUrl, metadata } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    // 単発決済の場合は customer を事前に取得/作成が必要（銀行振込の要件）
    let customer: string | undefined;
    if (mode === "payment") {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

      if (user[0]?.stripeCustomerId) {
        customer = user[0].stripeCustomerId;
      } else {
        const stripeCustomer = await stripe.customers.create({
          email: session.user.email || undefined,
          metadata: { userId: session.user.id },
        });
        customer = stripeCustomer.id;
        // DBに保存
        await db
          .update(users)
          .set({ stripeCustomerId: customer })
          .where(eq(users.id, session.user.id));
      }
    }

    // Stripe Checkout Sessionを作成
    const checkoutSession = await stripe.checkout.sessions.create({
      mode,
      customer: mode === "payment" ? customer : undefined,
      customer_email: mode === "subscription" ? (session.user.email || undefined) : undefined,
      client_reference_id: session.user.id,
      // 単発決済時は銀行振込・コンビニのみ（クレジットカード非表示）
      payment_method_types: mode === "payment"
        ? ["customer_balance", "konbini"]
        : undefined,
      // 銀行振込の設定
      ...(mode === "payment" && {
        payment_method_options: {
          customer_balance: {
            funding_type: "bank_transfer",
            bank_transfer: {
              type: "jp_bank_transfer",
            },
          },
        },
      }),
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${request.nextUrl.origin}/subscribe/success`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/subscribe/cancel`,
      metadata: {
        userId: session.user.id,
        ...metadata,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
