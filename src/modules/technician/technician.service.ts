import { prisma } from "../../lib/prisma";
import {
  TCreateTechnicianProfilePayload,
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
const updateAvailability = async () => {};
const getMe = async (userId: string) => {
  const profile = await prisma.technicianProfile.findFirstOrThrow({
    where: {
      userId: userId,
    },
  });
  return profile;
};
const getBooking = async () => {};
const getProfile = async (technicianProfileId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: technicianProfileId,
    },
    include: {
      service: true,
    },
  });
  
  return technician
};

export const technicianService = {
  create,
  updateAvailability,
  updateProfile,
  getMe,
  getBooking,
  getProfile,
};
