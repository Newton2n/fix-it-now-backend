import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { TCreateReviewPayload, TUpdateReviewPayload } from "./review.interface";

const create = async (customerId: string, payload: TCreateReviewPayload) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: payload.bookingId,
    },
  });
  if (booking.customerId !== customerId) {
    throw new Error("Sorry you can not write a review to another booking");
  }

  if (booking.status !== "COMPLETED") {
    throw new Error("Sorry the booking is not completed");
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
  return {
    name :"hello"
  }
};
const update = async (customerId: string, reviewId :string,payload: TUpdateReviewPayload) => {
  const isOneReviewExists = await prisma.review.findUniqueOrThrow({
    where: {
      id :reviewId,
    },
    include: {
      booking: true,
    },
  });
  if (isOneReviewExists?.booking.customerId !== customerId) {
    throw new Error("Sorry you cannot update another review");
  }



  const updateReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      ...payload,
    },
  });
  return updateReview;
};

//delete review
const remove = async (
  customerId: string,
  userRole: UserRole,
  reviewId: string,
) => {
  const isOneReviewExists = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
    },
    include: {
      booking: true,
    },
  });
  if (userRole !== "ADMIN") {
    if (isOneReviewExists?.booking.customerId !== customerId) {
      throw new Error("Sorry you cannot delete another review");
    }
  }

  const deleteReview = await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });
  return deleteReview;
};
const getAllMy = async (userId: string) => {
  const review = await prisma.review.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: true,
    },
  });

  return review;
};

export const reviewService = {
  create,
  getById,
  update,
  remove,
  getAllMy,
};
