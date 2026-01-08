import { NextRequest, NextResponse } from "next/server";

// Stripe webhook event types we handle
type StripeEventType =
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted"
  | "invoice.paid"
  | "invoice.payment_failed";

interface WebhookEvent {
  id: string;
  type: StripeEventType;
  data: {
    object: {
      id: string;
      customer: string;
      subscription?: string;
      status?: string;
      metadata?: {
        userId?: string;
      };
      customer_email?: string;
    };
  };
}

// In production, verify webhook signature:
/*
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function constructEvent(body: string, signature: string) {
  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
}
*/

// Handle subscription events
async function handleSubscriptionEvent(
  eventType: StripeEventType,
  data: WebhookEvent["data"]["object"]
) {
  const userId = data.metadata?.userId;
  const customerId = data.customer;
  const subscriptionId = data.subscription || data.id;
  const status = data.status;

  console.log(`Processing ${eventType} for user ${userId}`);

  switch (eventType) {
    case "checkout.session.completed":
      // User completed checkout - activate Pro subscription
      // await updateUserPlan(userId, 'pro', subscriptionId);
      console.log(`User ${userId} subscribed to Pro`);
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
      // Subscription status changed
      if (status === "active" || status === "trialing") {
        // await updateUserPlan(userId, 'pro', subscriptionId);
        console.log(`User ${userId} subscription active`);
      } else if (status === "canceled" || status === "unpaid") {
        // await updateUserPlan(userId, 'free', null);
        console.log(`User ${userId} subscription ${status}`);
      }
      break;

    case "customer.subscription.deleted":
      // Subscription was deleted - downgrade to free
      // await updateUserPlan(userId, 'free', null);
      console.log(`User ${userId} subscription deleted`);
      break;

    case "invoice.paid":
      // Payment successful
      console.log(`Payment received for user ${userId}`);
      break;

    case "invoice.payment_failed":
      // Payment failed - notify user
      // await sendPaymentFailedEmail(userId);
      console.log(`Payment failed for user ${userId}`);
      break;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    // In production, verify the webhook signature
    /*
    let event: Stripe.Event;
    try {
      event = await constructEvent(body, signature!);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
    */

    // For development, parse the body directly
    const event: WebhookEvent = JSON.parse(body);

    // Handle the event
    await handleSubscriptionEvent(event.type, event.data.object);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Disable body parsing for webhook (needed for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
};
