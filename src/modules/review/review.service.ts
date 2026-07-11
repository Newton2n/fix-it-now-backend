import { UserRole } from "../../../generated/prisma/enums";
import { ReviewWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  TCreateReviewPayload,
  TUpdateReviewPayload,
  TUserReviewSearchQuery,
} from "./review.interface";

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
    name: "hello",
  };
};
const update = async (
  customerId: string,
  reviewId: string,
  payload: TUpdateReviewPayload,
) => {
  const isOneReviewExists = await prisma.review.findUniqueOrThrow({
    where: {
      id: reviewId,
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
// get all reviews by login user
const getAllMy = async (
  userId: string,
  queryPayload: TUserReviewSearchQuery,
) => {
  const {
    limit,
    page,
    sortBy,
    sortOrder,
    maxRating,
    minRating,
    search,
    serviceId,
  } = queryPayload;
  const skipRow = (page - 1) * limit;

  const whereClause: ReviewWhereInput = {};

  //customer and service filter

  whereClause.booking = {};
  whereClause.booking.customerId = userId;

  if (serviceId) {
    whereClause.booking.serviceId = serviceId;
  }

  if (search) {
    whereClause.OR = [
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  //rating filtering
  if (minRating || maxRating) {
    whereClause.rating = {};
    if (minRating) {
      whereClause.rating.gte = minRating;
    }
    if (maxRating) {
      whereClause.rating.lte = maxRating;
    }
  }

  const orderBy =
    sortBy === "createdAt" ? { createdAt: sortOrder } : { rating: sortOrder };

  const reviewsCount = await prisma.review.count({
    where: whereClause,
  });
  const reviews = await prisma.review.findMany({
    where: {
      AND: whereClause,
    },
    take: limit,
    skip: skipRow,
    orderBy,
  });

  return {
    meta: {
      currentPage: page,
      limit,
      totalRow: reviewsCount,
      totalPage: Math.ceil(reviewsCount / limit),
    },
    data: reviews,
  };
};

export const reviewService = {
  create,
  getById,
  update,
  remove,
  getAllMy,
};
