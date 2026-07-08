import { UserActiveStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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
const getAllCategory = async () => {
  const allCategory = await prisma.category.findMany();
  return allCategory;
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
