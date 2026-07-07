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
  const isProfileExist = await prisma.technicianProfile.findFirstOrThrow({
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
  const isProfileExist = await prisma.technicianProfile.findFirstOrThrow({
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
  const profile = await prisma.technicianProfile.findFirstOrThrow({
    where: {
      userId: userId,
    },
  });
  return profile;
};
const getBooking = async (userId: string) => {
  const profile = await prisma.technicianProfile.findFirstOrThrow({
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
  const profile = await prisma.technicianProfile.findMany();
  return profile;
};

export const technicianService = {
  create,
  updateAvailability,
  updateProfile,
  getMe,
  getBooking,
  getProfile,
  getAll
};
