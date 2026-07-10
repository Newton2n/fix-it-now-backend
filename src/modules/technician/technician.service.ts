import { TechnicianStatus } from "../../../generated/prisma/enums";
import { TechnicianProfileWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  TCreateTechnicianProfilePayload,
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

const getAll = async () => {
 
  // const itemPerPage = Number(limit) || 10;
  // let pageNumber = Number(page) || 1;
  // let skipItem = (pageNumber - 1) * itemPerPage;

  // const whereClause :TechnicianProfileWhereInput = []


  const profile = await prisma.technicianProfile.findMany();
  return profile;
};
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
