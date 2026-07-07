import { prisma } from "../../lib/prisma";
import { TCreateTechnicianProfilePayload } from "./technician.interface";

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

  return result
};
const updateProfile = async () => {};
const updateAvailability = async () => {};
const getMe = async () => {};
const getBooking = async () => {};
const getProfile = async () => {};

export const technicianService = {
  create,
  updateAvailability,
  updateProfile,
  getMe,
  getBooking,
  getProfile,
};
