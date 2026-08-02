import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import { handlePaymentSuccess } from "./payment-utils";
import { TUserPaymentSearchQuery } from "./payment.interface";
import { PaymentWhereInput } from "../../../generated/prisma/models";

const checkoutSession = async (
  userId: string,
  userEmail: string,
  bookingId: string,
) => {
  const appUrl =config.app_url
  const frontendUrl = config.frontend_url
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
    },
  });


  if (booking.customerId !== userId) {
    throw new Error("Sorry you can not pay for another customer booking");
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
    success_url: `${frontendUrl}/dashboard/customer/payment/d7d52502-e463-4acf-b6e5-87ea91157a5b/success`,
    cancel_url: `${frontendUrl}/dashboard/customer/payment/d7d52502-e463-4acf-b6e5-87ea91157a5b/cancel`,
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

const getAllByLogInUser = async (userId: string,queryPayload :TUserPaymentSearchQuery) => {
   const {
     limit,
     page,
     sortBy,
     sortOrder,
     maxAmount,
     minAmount,
     provider,
     status,
     transactionId,
   } = queryPayload;
   const skipRow = (page - 1) * limit;
 
   const whereClause: PaymentWhereInput = {};
   whereClause.booking ={
    customerId :userId
   }

   //transaction id filter
   if (transactionId) {
     whereClause.transactionId = transactionId;
   }
 
   //provider filter
   if (provider) {
     whereClause.provider = provider;
   }
 
   //status filter
   if (status) {
     whereClause.status = status;
   }
 
   //rating filtering
   if (minAmount || maxAmount) {
     whereClause.amount = {};
     if (minAmount) {
       whereClause.amount.gte = minAmount;
     }
     if (maxAmount) {
       whereClause.amount.lte = maxAmount;
     }
   }
 
   const orderBy =
     sortBy === "createdAt"
       ? { createdAt: sortOrder }
       : sortBy === "amount"
         ? { amount: sortOrder }
         : sortBy === "status"
           ? { status: sortOrder }
           : {};
 
   const paymentCount = await prisma.payment.count({
     where: whereClause,
   });
   const payment = await prisma.payment.findMany({
     // only filtering
     where: whereClause,
     take: limit,
     skip: skipRow,
     orderBy,
   });
 
   return {
     meta: {
       currentPage: page,
       limit,
       totalRow: paymentCount,
       totalPage: Math.ceil(paymentCount / limit),
     },
     data: payment,
   };
};
const getByBookingId = async (bookingId :string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: {
      bookingId :bookingId
    }
  });

  return payment;
};
export const paymentService = {
  checkoutSession,
  webhookHandler,
  getAllByLogInUser,
  getByBookingId
};
