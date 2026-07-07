import { prisma } from "../../lib/prisma";
import { TCreateBookingPayload } from "./booking.interface";

const create = async (userId: string, payload: TCreateBookingPayload) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: payload.serviceId,
    },
    include: {
      technician: true,
    },
  });
  
  const technicianAvailability =service.technician.availability ;
  const bookingDate  =new Date(payload.scheduledAt)
};
const getAll = async () => {};
const getDetails = async () => {};
const update = async () => {};
export const bookingService = {
  create,
  getAll,
  getDetails,
  update,
};
