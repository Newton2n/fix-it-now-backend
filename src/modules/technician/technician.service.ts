import { TechnicianStatus } from "../../../generated/prisma/enums";
import {
  BookingWhereInput,
  ReviewWhereInput,
  ServiceWhereInput,
  TechnicianProfileWhereInput,
} from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { TSearchFilters } from "../service/service.interface";
import {
  TCreateTechnicianProfilePayload,
  TTechnicianBookingSearchQuery,
  TTechnicianReviewSearchQuery,
  TTechnicianSearchFilters,
  TUpdateAvailabilityPayload,
  TUpdateTechnicianProfilePayload,
} from "./technician.interface";

const create = async (
  userId: string,
  payload: TCreateTechnicianProfilePayload,
) => {
  const result = await prisma.technicianProfile.create({
    data: {
      userId: userId,
      ...payload,
    },
  });

  return result;
};
const updateProfile = async (
  userId: string,
  payload: TUpdateTechnicianProfilePayload,
) => {
  const isProfileExist = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });

  const update = await prisma.technicianProfile.update({
    where: {
      id: isProfileExist.id,
    },
    data: {
      ...payload,
    },
  });

  return update;
};
const updateAvailability = async (
  userId: string,
  payload: TUpdateAvailabilityPayload,
) => {
  const isProfileExist = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });

  const update = await prisma.technicianProfile.update({
    where: {
      id: isProfileExist.id,
    },
    data: {
      availability: payload,
    },
  });

  return update;
};
const getMe = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });
  return profile;
};
// get all booking by log in technician
const getBooking = async (
  userId: string,
  queryPayload: TTechnicianBookingSearchQuery,
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });
  const {
    limit,
    page,
    paymentStatus,
    sortBy,
    sortOrder,
    status,
    endDate,
    serviceId,
    startDate,
  } = queryPayload;
  const skipRow = (page - 1) * limit;
  const whereClause: BookingWhereInput = {};
  whereClause.service = {
    technicianId: technicianProfile.id,
  };

  if (status) {
    whereClause.status = status;
  }
  if (paymentStatus) {
    whereClause.payment = {
      status: paymentStatus,
    };
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

  const bookingsCount = await prisma.booking.count({
    where: whereClause,
  });
  const bookings = await prisma.booking.findMany({
    //only filtering
    where: whereClause,
    include: {
      review: true,
    },
    skip: skipRow,
    take: limit,
    orderBy,
  });

  return {
    meta: {
      currentPage: page,
      limit,
      totalRow: bookingsCount,
      totalPage: Math.ceil(bookingsCount / limit),
    },
    data: bookings,
  };
};
// get all services by log in technician
const getServices = async (userId: string, queryPayload: TSearchFilters) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });

  const {
    search,
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
    isAvailable = "true",
    sortBy,
    sortOrder,
  } = queryPayload;

  const itemPerPage = limit;
  const skip = (page - 1) * itemPerPage;

  const whereClause: ServiceWhereInput = {};
  whereClause.technicianId = technicianProfile.id;
  // Search
  if (search) {
    whereClause.OR = [
      {
        title: {
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

  // Category Filter
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  // Price Filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};

    if (minPrice !== undefined) {
      whereClause.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      whereClause.price.lte = maxPrice;
    }
  }

  // Sort
  const orderBy =
    sortBy === "price" ? { price: sortOrder } : { createdAt: sortOrder };

  if (isAvailable !== "true" && isAvailable !== "false") {
    throw new Error("Is available field can be true or false");
  }

  // default isAvailable
  if (isAvailable === "false") {
    whereClause.isAvailable = false;
  } else if (isAvailable === "true") {
    whereClause.isAvailable = true;
  }

  // Total count
  const total = await prisma.service.count({
    where: whereClause,
  });

  // Get services
  const services = await prisma.service.findMany({
    where: { AND: whereClause },
    orderBy,
    skip,
    take: itemPerPage,
  });

  return {
    meta: {
      currentPage: page,
      limit: itemPerPage,
      totalRow: total,
      totalPage: Math.ceil(total / itemPerPage),
    },
    data: services,
  };
};
// get single profile
const getProfile = async (technicianProfileId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: technicianProfileId,
    },
    include: {
      service: true,
    },
  });

  return technician;
};

// get all profile
const getAll = async (queryPayload: TTechnicianSearchFilters) => {
  const {
    limit,
    page,
    sortBy,
    sortOrder,
    isAvailable = "true",
    minExperience,
    search,
    status,
    serviceArea,
    skills,
  } = queryPayload;

  const itemPerPage = limit || 10;
  let pageNumber = page || 1;
  let skipItem = (pageNumber - 1) * itemPerPage;

  const whereClause: TechnicianProfileWhereInput = {};

  if (search) {
    whereClause.OR = [
      {
        bio: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        user: {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
    ];
  }
  if (status) {
    whereClause.status = {
      equals: status,
    };
  }

  if (minExperience) {
    whereClause.yearsOfExperience = {
      gte: minExperience,
    };
  }

  if (isAvailable !== "true" && isAvailable !== "false") {
    throw new Error("Is available field can be true or false");
  }

  // default isAvailable
  if (isAvailable === "false") {
    whereClause.isAvailable = false;
  } else if (isAvailable === "true") {
    whereClause.isAvailable = true;
  }

  //skills match
  if (skills) {
    whereClause.skills = {
      hasSome: skills.replace(/[\[\]"]/g, "").split(","),
    };
  }

  //service area match
  if (serviceArea) {
    whereClause.serviceArea = {
      hasSome: serviceArea.replace(/[\[\]"]/g, "").split(","),
    };
  }

  //order by
  const orderBy =
    sortBy === "date"
      ? { createdAt: sortOrder }
      : { yearsOfExperience: sortOrder };

  const profileCount = await prisma.technicianProfile.count({
    where: {
      AND: whereClause,
    },
  });

  const profiles = await prisma.technicianProfile.findMany({
    where: {
      AND: whereClause,
    },
    take: itemPerPage,
    skip: skipItem || 0,
    orderBy,
  });

  return {
    meta: {
      page: pageNumber,
      limit: itemPerPage,
      totalRow: profileCount,
      totalPage: Math.ceil(profileCount / itemPerPage),
    },
    data: profiles,
  };
};

// verify technician
const verify = async (technicianId: string, newStatus: TechnicianStatus) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: technicianId,
    },
  });

  const updateStatus = await prisma.technicianProfile.update({
    where: {
      id: technicianId,
    },
    data: {
      status: newStatus,
    },
    include: {
      user: true,
    },
  });
  return {
    technicianId: updateStatus.id,
    technicianName: updateStatus.user.name,
    newStatus: updateStatus.status,
  };
};

const getAllReviews = async (
  technicianId: string,
  queryPayload: TTechnicianReviewSearchQuery,
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

  const whereClause: ReviewWhereInput = {
    booking: {
      service: {
        technicianId: technicianId,
      },
    },
  };

  // service filter
  if (serviceId) {
    whereClause.booking = {
      serviceId,
      service: {
        technicianId,
      },
    };
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
export const technicianService = {
  create,
  updateAvailability,
  updateProfile,
  getMe,
  getBooking,
  getProfile,
  getAll,
  verify,
  getAllReviews,
  getServices,
};
