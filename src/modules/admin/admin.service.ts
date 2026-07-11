import { UserActiveStatus } from "../../../generated/prisma/enums";
import {
  BookingWhereInput,
  CategoryWhereInput,
  PaymentWhereInput,
  ReviewWhereInput,
  UserWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { TCategorySearchQuery } from "../category/category.interface";
import {
  TBookingSearchQuery,
  TPaymentSearchQuery,
  TReviewSearchQuery,
  TUserSearchQuery,
} from "./admin.interface";

// find user
const findUser = async (queryPayload: TUserSearchQuery) => {
  const {
    limit,
    page,
    role,
    sortBy,
    sortOrder,
    status,
    country,
    email,
    phoneNumber,
    search,
  } = queryPayload;

  const skipItem = (page - 1) * limit;
  const whereClause: UserWhereInput = {};

  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }
  if (email) {
    whereClause.email = {
      contains: email,
      mode: "insensitive",
    };
  }
  if (phoneNumber) {
    whereClause.phoneNumber = phoneNumber;
  }
  if (country) {
    whereClause.country = country;
  }
  if (status) {
    whereClause.status = status;
  }
  if (role) {
    whereClause.role = role;
  }

  const orderBy =
    sortBy === "createdAt"
      ? { createdAt: sortOrder }
      : sortBy === "name"
        ? { name: sortOrder }
        : sortBy === "role"
          ? { role: sortOrder }
          : {};

  const usersCount = await prisma.user.count({
    where: whereClause,
  });
  const users = await prisma.user.findMany({
    where: {
      AND: whereClause,
    },
    take: limit,
    skip: skipItem,
    orderBy,
    omit: { password: true },
  });
  return {
    meta: {
      currentPage: page,
      limit,
      totalRow: usersCount,
      totalPage: Math.ceil(usersCount / limit),
    },
    data: users,
  };
};

//update user status
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

// find bookings
const findBooking = async (queryPayload: TBookingSearchQuery) => {
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

// find category
const findCategory = async (queryPayload: TCategorySearchQuery) => {
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
const findReviews = async (queryPayload: TReviewSearchQuery) => {
  const {
    limit,
    page,
    sortBy,
    sortOrder,
    maxRating,
    minRating,
    search,
    serviceId,
    customerId,
  } = queryPayload;
  const skipRow = (page - 1) * limit;

  const whereClause: ReviewWhereInput = {};
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

  //customer and service filter
  if (customerId || serviceId) {
    whereClause.booking = {};
    if (customerId) {
      whereClause.booking.customerId = customerId;
    }
    if (serviceId) {
      whereClause.booking.serviceId = serviceId;
    }
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

//find payment
const findPayments = async (queryPayload: TPaymentSearchQuery) => {
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

export const adminService = {
  findUser,
  updateUserStatus,
  findBooking,
  findCategory,
  findReviews,
  findPayments,
};
