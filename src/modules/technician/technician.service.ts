import { TechnicianStatus } from "../../../generated/prisma/enums";
import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  TCreateTechnicianProfilePayload,
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
const getBooking = async (userId: string) => {
  const profile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId: userId,
    },
  });

  const bookings = await prisma.booking.findMany({
    where: {
      service: {
        technicianId: profile.id,
      },
    },
  });

  return bookings;
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

  console.log(whereClause.serviceArea);
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

const getAllReviews = async (technicianId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      booking: {
        service: { technicianId: technicianId },
      },
    },
    select: {
      id: true,
      description: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
      booking: {
        select: {
          service: true,
        },
      },
    },
  });
  return reviews;
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
};
