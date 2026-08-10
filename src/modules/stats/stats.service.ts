import { prisma } from "../../lib/prisma";

const getAll = async () => {
  // Get services
  const servicesCount = await prisma.service.count();
  const verifiedTechnicianCount = await prisma.technicianProfile.count({
    where: {
      status: "VERIFIED",
    },
  });
  const bookingCount = await prisma.booking.count();
  const userCount = await prisma.user.count({
    where: {
      status: "ACTIVE",
    },
  });
  const reviewsCount = await prisma.review.count();
  const categoriesCount = await prisma.category.count();
  const paymentsCount = await prisma.payment.count({
    where: {
      status: "SUCCEEDED",
    },
  });
  const avgRating = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
  });
  const averageRating = Number(avgRating._avg.rating!.toFixed(1));

  return {
    categoriesCount,
    servicesCount,
    verifiedTechnicianCount,
    bookingCount,
    paymentsCount,
    userCount,
    reviewsCount,
    averageRating,
  };
};

export const statsService = { getAll };
