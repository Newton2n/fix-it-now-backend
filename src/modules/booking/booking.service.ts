import { BookingStatus } from "../../../generated/prisma/enums";
import { BookingWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  TCreateBookingPayload,
  TTechnicianTimeSchedule,
  TUserBookingSearchQuery,
} from "./booking.interface";

const create = async (
  userId: string,
  payload: TCreateBookingPayload,
) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: payload.serviceId,
    },
    include: {
      technician: true,
    },
  });

  const technicianAvailability =
    service.technician.availability as TTechnicianTimeSchedule;

  const customerBookingDate = new Date(payload.scheduledAt);

  if (Number.isNaN(customerBookingDate.getTime())) {
    throw new Error("Invalid booking date and time");
  }

  // Make sure the booking is in the future.
  if (customerBookingDate <= new Date()) {
    throw new Error("Sorry you cannot book a previous date or time");
  }

  /*
   * IMPORTANT:
   * Your application schedule is based on Bangladesh time.
   *
   * Do not use the server's local timezone here.
   */
  const dhakaDateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Dhaka",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(customerBookingDate);

  const weekDay = dhakaDateParts
    .find((part) => part.type === "weekday")
    ?.value.toLowerCase();

  const hour = Number(
    dhakaDateParts.find((part) => part.type === "hour")?.value,
  );

  const minute = Number(
    dhakaDateParts.find((part) => part.type === "minute")?.value,
  );

  if (!weekDay || Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new Error("Unable to determine booking date and time");
  }

  const bookingMinute = minute;

  if (bookingMinute !== 0 && bookingMinute !== 30) {
    throw new Error(
      "Bookings are only available every 30 minutes",
    );
  }

  const todayAvailability = technicianAvailability[weekDay];

  if (!todayAvailability) {
    throw new Error(
      `Technician unavailable on ${weekDay}`,
    );
  }

  const bookingMinutes = hour * 60 + minute;


  const timeToMinutes = (time: string) => {
    const match = time
      .trim()
      .toUpperCase()
      .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);

    if (!match) {
      throw new Error(`Invalid availability time: ${time}`);
    }

    let hours = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3];

    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    if (period === "PM" && hours !== 12) {
      hours += 12;
    }

    return hours * 60 + minutes;
  };

  const startMinutes = timeToMinutes(todayAvailability.start);
  const endMinutes = timeToMinutes(todayAvailability.end);

  if (
    bookingMinutes < startMinutes ||
    bookingMinutes > endMinutes
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
    throw new Error("This time slot is already booked");
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
const getAll = async (
  userId: string,
  queryPayload: TUserBookingSearchQuery,
) => {
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
  whereClause.customerId = userId;

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

//get booking details by id
const getDetails = async (bookingId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
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
  if (newStatus === "DECLINED") {
    const update = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: newStatus,
        scheduledAt: null,
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
  } else {
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
  }
};

const cancelBookingByCustomer = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: {
      id: bookingId,
    },
  });

  if (booking.customerId !== userId) {
    throw new Error("Sorry You can not cancel another customer booking");
  }

  if (booking.status === "CANCELED") {
    throw new Error("This booking has been canceled.");
  }

  const allowedToCancel = ["REQUESTED", "ACCEPTED", "PAID"];

  if (!allowedToCancel.includes(booking.status)) {
    throw new Error("This booking cannot be canceled in its current state.");
  }

  const cancel = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELED",
      scheduledAt: null,
    },
  });

  return cancel;
};
export const bookingService = {
  create,
  getAll,
  getDetails,
  updateStatusByTechnician,
  cancelBookingByCustomer,
};
