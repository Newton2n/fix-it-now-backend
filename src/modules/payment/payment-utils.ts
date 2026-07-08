import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handlePaymentSuccess = async (
  session: Stripe.Checkout.Session,
) => {
  const transactionPayment = await prisma.$transaction(async (tx) => {
    const paymentStatus: PaymentStatus =
      session.payment_status === "paid" ? "SUCCEEDED" : "FAILED";
    const payment = await tx.payment.findUnique({
      where: {
        bookingId: session.metadata!.bookingId,
      },
    });
    if (!payment) {
      throw new Error("Payment record not found.");
    }

    if (payment?.status === "SUCCEEDED") {
      return;
    }

    await tx.payment.update({
      where: {
        bookingId: session?.metadata?.bookingId,
      },
      data: {
        transactionId: session.payment_intent as string,
        paymentMethod: session.payment_method_types[0],
        status: paymentStatus,
      },
    });
    if (paymentStatus === "SUCCEEDED") {
      await tx.booking.update({
        where: {
          id: session.metadata!.bookingId,
        },
        data: {
          status: "PAID",
        },
      });
    }
  });
};
