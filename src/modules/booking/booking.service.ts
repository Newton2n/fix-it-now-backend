import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  TCreateBookingPayload,
  TTechnicianTimeSchedule,
} from "./booking.interface";

const create = async (userId: string, payload: TCreateBookingPayload) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: payload.serviceId,
    },
    include: {
      technician: true,
    },
  });

  const technicianAvailability = service.technician
    .availability as TTechnicianTimeSchedule;

  const customerBookingDate = new Date(payload.scheduledAt);
  console.log("booking date raw with new Date", customerBookingDate);
  const bookingMinute = customerBookingDate.getMinutes();

  if (bookingMinute !== 0 && bookingMinute !== 30) {
    throw new Error("Bookings are only available every 30 minutes");
  }

  // give week day like (saturday,friday)
  const weekDay = customerBookingDate
    .toLocaleDateString("en-US", {
      weekday: "long",
    })
    .toLowerCase();

  console.log("weekday", weekDay);

  const todayAvailability = technicianAvailability[weekDay];

  if (!todayAvailability) {
    throw new Error(`Technician unavailable on ${weekDay}`);
  }

  const bookingTime = customerBookingDate.toTimeString().slice(0, 5);

  console.log("booking exact time", bookingTime);

  if (
    bookingTime < todayAvailability.start ||
    bookingTime > todayAvailability.end
  ) {
    throw new Error("Outside working hours");
  }

  const bookingExists = await prisma.booking.findFirst({
    where: {
      service: {
        technicianId: service.technicianId,
      },
      scheduledAt: customerBookingDate,
      status: {
        not: "DECLINED",
      },
    },
  });

  if (bookingExists) {
    throw new Error(`${customerBookingDate} Time slot already booked`);
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: userId,
      ...payload,
    },
  });
  return booking;
};

// get all booking by log in user
const getAll = async (userId: string) => {
  const booking = await prisma.booking.findMany({
    where: {
      customerId: userId,
    },
  });

  return booking;
};
const getDetails = async (bookingId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });
  return booking;
};

const updateStatusByTechnician = async (
  bookingId: string,
  userId: string,
  newStatus: BookingStatus,
) => {
  // Allowed transitions for the technician
  const technicianRules: Record<BookingStatus, BookingStatus[]> = {
    REQUESTED: ["ACCEPTED", "DECLINED"],
    ACCEPTED: [],
    PAID: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETED"],
    DECLINED: [],
    CANCELED: [],
    COMPLETED: [],
  };
  // technician profile
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  //  booking and verify it belongs to this technician
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
    },
  });

  if (technicianProfile.id !== booking!.service.technicianId) {
    throw new Error("You cannot change another technician booking");
  }

  //  Validate the transition using the rules
  const allowedNextStatuses = technicianRules[booking!.status];

  if (!allowedNextStatuses.includes(newStatus)) {
    throw new Error(
      `Technician cannot change status from ${booking!.status} to ${newStatus}`,
    );
  }

  // 4. Update the booking status
  const update = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: newStatus,
    },
    include: {
      service: true,
    },
  });

  return {
    bookingId: update.id,
    serviceName: update.service.title,
    newStatus: update.status,
  };
};

export const bookingService = {
  create,
  getAll,
  getDetails,
  updateStatusByTechnician,
};
