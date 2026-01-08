import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS, formatCurrency } from "@/lib/stripe";

// Mock checkout session creation
// In production, use actual Stripe SDK:
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CheckoutRequest {
  priceId: string;
  billingPeriod: "monthly" | "yearly";
  userId?: string;
  email?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();
    const { priceId, billingPeriod, userId, email, successUrl, cancelUrl } = body;

    // Validate price ID
    const validPriceIds = [
      PRODUCTS.pro.monthly.priceId,
      PRODUCTS.pro.yearly.priceId,
    ];

    if (!priceId || !validPriceIds.includes(priceId)) {
      return NextResponse.json(
        { error: "Invalid price ID" },
        { status: 400 }
      );
    }

    // Get product info
    const product = billingPeriod === "yearly"
      ? PRODUCTS.pro.yearly
      : PRODUCTS.pro.monthly;

    // In production, create actual Stripe checkout session:
    /*
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade`,
      customer_email: email,
      metadata: {
        userId,
      },
      subscription_data: {
        trial_period_days: 7,
      },
    });
    */

    // Mock response for development
    const mockSessionId = `cs_mock_${Date.now()}`;
    const mockCheckoutUrl = `/checkout/mock?session=${mockSessionId}&price=${priceId}`;

    return NextResponse.json({
      sessionId: mockSessionId,
      url: mockCheckoutUrl,
      product: {
        name: "Brandspark Pro",
        amount: formatCurrency(product.amount),
        interval: product.interval,
      },
      // In production, return actual Stripe checkout URL
      message: "Mock checkout created. In production, redirect to Stripe.",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
