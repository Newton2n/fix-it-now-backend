import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import { handlePaymentSuccess } from "./payment-utils";

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

  const findPayment = await prisma.payment.findUnique({
    where: {
      bookingId: booking.id,
    },
  });
  if (findPayment?.status === "SUCCEEDED") {
    throw new Error("This booking has already been paid.");
  }

  if (!findPayment) {
    const createPaymentData = await prisma.payment.create({
      data: {
        provider: "STRIPE",
        bookingId: booking.id,
        currency: "USD",
        amount: booking.service.price,
      },
    });
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
      bookingId: booking.id,
    },
    success_url: "http://localhost:5000/api/payment?success=true",
    cancel_url: "http://localhost:5000/api/payment?success=false",
  });
  return { checkoutUrl: session.url };
};

const webhookHandler = async (payload: Buffer, signature: string) => {
  const webhookSecret = config.stripe_webhook_secret;
  const event: Stripe.Event = stripe.webhooks.constructEvent(
    payload,
    signature!,
    webhookSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      await handlePaymentSuccess(session);

      break;

    default:
  }
};

const getAllByLogInUser = async (userId: string) => {
  const payment = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payment;
};
const getById = async (paymentId :string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      id :paymentId
    }
  });

  return payment;
};
export const paymentService = {
  checkoutSession,
  webhookHandler,
  getAllByLogInUser,
  getById
};
