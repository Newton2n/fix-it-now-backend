import { prisma } from "../../lib/prisma";
import { TCreateReviewPayload } from "./review.interface";

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

  const isOneReviewExists = await prisma.review.findUnique({
    where: {
      bookingId: payload.bookingId,
    },
  });

  if (isOneReviewExists) {
    throw new Error(
      "Sorry this booking has already a review you can customize it only",
    );
  }

  const createReview = await prisma.review.create({
    data: {
      ...payload,
    },
  });
  return createReview;
};
const getById = async (reviewId: string) => {
  const review = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
  });
  return review
};
const update = async () => {};
const remove = async () => {};
const getAll = async () => {};

export const reviewService = {
  create,
  getById,
  update,
  remove,
  getAll,
};
