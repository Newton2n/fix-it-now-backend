import { UserActiveStatus } from "../../../generated/prisma/enums";
import { CategoryWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { TCategorySearchFilters } from "../category/category.interface";

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
const getAllBooking = async () => {
  const allBooking = await prisma.booking.findMany();
  return allBooking;
};
const getAllCategory = async (queryPayload:TCategorySearchFilters) => {
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
      page: page,
      limit: itemPerPage,
      totalRow: categoriesCount,
      totalPage: Math.ceil(categoriesCount / itemPerPage),
    },
    data: categories,
  };
};
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
