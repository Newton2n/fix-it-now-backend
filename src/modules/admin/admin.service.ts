import { UserActiveStatus } from "../../../generated/prisma/enums";
import {
  BookingWhereInput,
  CategoryWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { TCategorySearchFilters } from "../category/category.interface";
import { TBookingSearchQuery } from "./admin.interface";

const getAllUser = async () => {
  const allUser = await prisma.user.findMany({
    omit: { password: true },
  });
  return allUser;
};
const updateUserStatus = async (
  userId: string,
  newStatus: UserActiveStatus,
) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const updateStatus = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: newStatus,
    },
  });

  return updateStatus;
};

// get all bookings
const getAllBooking = async (queryPayload: TBookingSearchQuery) => {
  const {
    status,
    paymentStatus,
    customerId,
    serviceId,
    startDate,
    endDate,
    page,
    limit,
    sortBy,
    sortOrder,
  } = queryPayload;
  console.log(queryPayload);
  const itemPerPage = limit;
  const skip = (page - 1) * itemPerPage;

  const whereClause: BookingWhereInput = {};

  if (status) {
    whereClause.status = status;
  }
  // filter payment status
  if (paymentStatus) {
    whereClause.payment = {
      status: paymentStatus,
    };
  }

  if (customerId) {
    whereClause.customerId = customerId;
  }
  if (serviceId) {
    whereClause.serviceId = serviceId;
  }

  //date filtering (between if both)
  if (startDate || endDate) {
    whereClause.scheduledAt = {};

    if (startDate) {
      whereClause.scheduledAt.gte = startDate;
    }
    if (endDate) {
      whereClause.scheduledAt.lte = endDate;
    }
  }
  const orderBy =
    sortBy === "createdAt"
      ? { createdAt: sortOrder }
      : { scheduledAt: sortOrder };

  const allBookingCount = await prisma.booking.count({
    where: whereClause,
  });
  const allBookings = await prisma.booking.findMany({
    //only filtering
    where: whereClause,
    skip: skip,
    take: itemPerPage,
    orderBy,
  });

  return {
    meta: {
      currentPage: page,
      limit: itemPerPage,
      totalRow: allBookingCount,
      totalPage: Math.ceil(allBookingCount / itemPerPage),
    },
    data: allBookings,
  };
};

// get all category
const getAllCategory = async (queryPayload: TCategorySearchFilters) => {
  const { limit, page, sortBy, sortOrder, search } = queryPayload;

  const itemPerPage = limit;
  const skip = (page - 1) * itemPerPage;

  const whereClause: CategoryWhereInput = {};
  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy =
    sortBy === "createdAt" ? { createdAt: sortOrder } : { name: sortOrder };
  const categoriesCount = await prisma.category.count({
    where: {
      AND: whereClause,
    },
  });
  const categories = await prisma.category.findMany({
    where: {
      AND: whereClause,
    },
    skip: skip,
    take: itemPerPage,
    orderBy,
  });
  return {
    meta: {
      currentPage: page,
      limit: itemPerPage,
      totalRow: categoriesCount,
      totalPage: Math.ceil(categoriesCount / itemPerPage),
    },
    data: categories,
  };
};

// get all reviews
const getAllReviews = async () => {
  const allReviews = await prisma.review.findMany();
  return allReviews;
};

export const adminService = {
  getAllUser,
  updateUserStatus,
  getAllBooking,
  getAllCategory,
  getAllReviews,
};
