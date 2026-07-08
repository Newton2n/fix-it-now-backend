import { prisma } from "../../lib/prisma";
import { TCreateReviewPayload, TUpdateReviewPayload } from "./review.interface";

const create = async (customerId: string, payload: TCreateReviewPayload) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: payload.bookingId,
    },
  });

  if (booking.status !== "COMPLETED") {
    throw new Error("Sorry the booking is still not completed");
  }

  if (booking.customerId !== customerId) {
    throw new Error("Sorry you can not write a review to another booking");
  }

  const createReviewTransaction = await prisma.$transaction(async (tx) => {
    const isOneReviewExists = await tx.review.findUnique({
      where: {
        bookingId: payload.bookingId,
      },
    });

    if (isOneReviewExists) {
      throw new Error(
        "Sorry this booking has already a review you can customize it only",
      );
    }

    const createReview = await tx.review.create({
      data: {
        ...payload,
      },
    });
    return createReview;
  });
  return createReviewTransaction;
};
const getById = async (reviewId: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });
  return review;
};
const update = async (customerId: string, payload: TUpdateReviewPayload) => {
  const isOneReviewExists = await prisma.review.findUnique({
    where: {
      bookingId: payload.bookingId,
    },
    include: {
      booking: true,
    },
  });
  if (isOneReviewExists?.booking.customerId !== customerId) {
    throw new Error("Sorry you cannot update another review");
  }

  if (isOneReviewExists) {
    throw new Error(
      "Sorry this booking has already a review you can customize it only",
    );
  }

  const { bookingId, ...restPayload } = payload;

  const createReview = await prisma.review.update({
    where: {
      bookingId: payload.bookingId,
    },
    data: {
      ...restPayload,
    },
  });
  return createReview;
};
const remove = async () => {};
const getAll = async () => {};

export const reviewService = {
  create,
  getById,
  update,
  remove,
  getAll,
};
