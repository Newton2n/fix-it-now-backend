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
//admin stats
const admin = async () => {
  const [
    categoriesCount,
    servicesCount,
    verifiedTechnicianCount,
    bookingCount,
    activeUserCount,
    customerCount,
    technicianCount,
    reviewsCount,
    successfulPaymentsCount,
    revenue,
    averageRating,

    requestedBookings,
    acceptedBookings,
    declinedBookings,
    canceledBookings,
    paidBookings,
    inProgressBookings,
    completedBookings,

    recentBookings,
  ] = await Promise.all([
    prisma.category.count(),

    prisma.service.count(),

    prisma.technicianProfile.count({
      where: {
        status: "VERIFIED",
      },
    }),

    prisma.booking.count(),

    prisma.user.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.user.count({
      where: {
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    }),

    prisma.user.count({
      where: {
        role: "TECHNICIAN",
        status: "ACTIVE",
      },
    }),

    prisma.review.count(),

    prisma.payment.count({
      where: {
        status: "SUCCEEDED",
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    }),

    prisma.booking.count({
      where: { status: "REQUESTED" },
    }),

    prisma.booking.count({
      where: { status: "ACCEPTED" },
    }),

    prisma.booking.count({
      where: { status: "DECLINED" },
    }),

    prisma.booking.count({
      where: { status: "CANCELED" },
    }),

    prisma.booking.count({
      where: { status: "PAID" },
    }),

    prisma.booking.count({
      where: { status: "IN_PROGRESS" },
    }),

    prisma.booking.count({
      where: { status: "COMPLETED" },
    }),

    prisma.booking.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        location: true,
        createdAt: true,

        user: {
          select: {
            name: true,
            email: true,
          },
        },

        service: {
          select: {
            title: true,
            price: true,
          },
        },

        payment: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return {
    overview: {
      categoriesCount,
      servicesCount,
      verifiedTechnicianCount,
      bookingCount,
      activeUserCount,
      customerCount,
      technicianCount,
      reviewsCount,
      successfulPaymentsCount,
      revenue: revenue._sum.amount ?? 0,
      averageRating: Number(
        (averageRating._avg.rating ?? 0).toFixed(1),
      ),
    },

    bookingStatus: {
      requested: requestedBookings,
      accepted: acceptedBookings,
      declined: declinedBookings,
      canceled: canceledBookings,
      paid: paidBookings,
      inProgress: inProgressBookings,
      completed: completedBookings,
    },

    recentBookings,
  };
};

//login technician stats
const technician = async (userId: string) => {
  const technicianProfile =
    await prisma.technicianProfile.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
        status: true,
        isAvailable: true,
      },
    });

  if (!technicianProfile) {
    throw new Error("Technician profile not found");
  }

  const technicianId = technicianProfile.id;

  const [
    servicesCount,
    activeServicesCount,
    totalBookings,
    completedBookings,
    pendingBookings,
    canceledBookings,
    reviewsCount,
    averageRating,
    earnings,
    recentBookings,
  ] = await Promise.all([
    prisma.service.count({
      where: {
        technicianId,
      },
    }),

    prisma.service.count({
      where: {
        technicianId,
        isAvailable: true,
      },
    }),

    prisma.booking.count({
      where: {
        service: {
          technicianId,
        },
      },
    }),

    prisma.booking.count({
      where: {
        service: {
          technicianId,
        },
        status: "COMPLETED",
      },
    }),

    prisma.booking.count({
      where: {
        service: {
          technicianId,
        },
        status: {
          in: ["REQUESTED", "ACCEPTED"],
        },
      },
    }),

    prisma.booking.count({
      where: {
        service: {
          technicianId,
        },
        status: "CANCELED",
      },
    }),

    prisma.review.count({
      where: {
        booking: {
          service: {
            technicianId,
          },
        },
      },
    }),

    prisma.review.aggregate({
      where: {
        booking: {
          service: {
            technicianId,
          },
        },
      },
      _avg: {
        rating: true,
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
        booking: {
          service: {
            technicianId,
          },
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.booking.findMany({
      where: {
        service: {
          technicianId,
        },
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        location: true,

        user: {
          select: {
            name: true,
            email: true,
          },
        },

        service: {
          select: {
            title: true,
          },
        },

        payment: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return {
    overview: {
      servicesCount,
      activeServicesCount,
      totalBookings,
      completedBookings,
      pendingBookings,
      canceledBookings,
      reviewsCount,
      averageRating: Number(
        (averageRating._avg.rating ?? 0).toFixed(1),
      ),
      earnings: earnings._sum.amount ?? 0,
    },

    recentBookings,
  };
};

//login customer stats
const customer = async (userId: string) => {
  const [
    totalBookings,
    requestedBookings,
    acceptedBookings,
    completedBookings,
    canceledBookings,
    totalReviews,
    paymentsCount,
    totalSpent,
    recentBookings,
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        customerId: userId,
      },
    }),

    prisma.booking.count({
      where: {
        customerId: userId,
        status: "REQUESTED",
      },
    }),

    prisma.booking.count({
      where: {
        customerId: userId,
        status: "ACCEPTED",
      },
    }),

    prisma.booking.count({
      where: {
        customerId: userId,
        status: "COMPLETED",
      },
    }),

    prisma.booking.count({
      where: {
        customerId: userId,
        status: "CANCELED",
      },
    }),

    prisma.review.count({
      where: {
        booking: {
          customerId: userId,
        },
      },
    }),

    prisma.payment.count({
      where: {
        status: "SUCCEEDED",
        booking: {
          customerId: userId,
        },
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "SUCCEEDED",
        booking: {
          customerId: userId,
        },
      },
      _sum: {
        amount: true,
      },
    }),

    prisma.booking.findMany({
      where: {
        customerId: userId,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        status: true,
        scheduledAt: true,
        location: true,

        service: {
          select: {
            title: true,
            price: true,

            technician: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },

        payment: {
          select: {
            amount: true,
            status: true,
          },
        },
      },
    }),
  ]);

  return {
    overview: {
      totalBookings,
      requestedBookings,
      acceptedBookings,
      completedBookings,
      canceledBookings,
      totalReviews,
      paymentsCount,
      totalSpent: totalSpent._sum.amount ?? 0,
    },

    recentBookings,
  };
};

export const statsService = { getAll ,technician,customer,admin};
