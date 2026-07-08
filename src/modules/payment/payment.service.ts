import { setEngine } from "node:crypto";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";

const checkoutSession = async (
  userId: string,
  userEmail: string,
  bookingId: string,
) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      customerId: userId,
    },
    include: {
      service: true,
    },
  });

  if (!booking) {
    throw new Error("Sorry booking is not available");
  }
  if (booking.status !== "ACCEPTED") {
    throw new Error(
      "You cannot pay for a booking that hasn't been accepted by a technician or has been canceled",
    );
  }
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: userEmail,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: booking.service.title,
          },
          unit_amount: booking.service.price * 100,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: userId,
    },
    success_url: "http://localhost:5000/api/payment?success=true",
    cancel_url: "http://localhost:5000/api/payment?success=false",
  });
  return { checkoutUrl: session.url };
};

const webhookHandler = async (payload: Buffer, signature: string) => {
  const webhookSecret = config.stripe_webhook_secret
  const event: Stripe.Event = stripe.webhooks.constructEvent(
    payload,
    signature!,
    webhookSecret,
  );
  //  console.log(event)
  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      console.log("customer payment event checkout session complete triggered ", event.type);
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("session",session)
      break;

    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
};

export const paymentService = {
  checkoutSession,
  webhookHandler,
};
