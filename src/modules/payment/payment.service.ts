import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

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
    throw new Error("You can not pay before technician accept booking");
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

export const paymentService = {
  checkoutSession,
};
