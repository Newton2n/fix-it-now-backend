import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { technicianService } from "./technician.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { TTechnicianSearchFilters } from "./technician.interface";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payload = req.body;
    if (!user?.id) {
      throw new Error("User id required Please log in");
    }
    const result = await technicianService.create(user.id, payload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Technician Profile Created Successfully",
      data: {
        result,
      },
    });
  },
);
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payload = req.body;
    if (!user?.id) {
      throw new Error("User id required Please log in");
    }

    const result = await technicianService.updateProfile(user.id, payload);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Technician Profile Updated Successfully",
      data: {
        result,
      },
    });
  },
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user?.id) {
      throw new Error("User id required Please log in");
    }

    const result = await technicianService.getMe(user.id);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your Technician Profile Retrieve Successfully",
      data: {
        result,
      },
    });
  },
);
const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payload = req.body;

    
    if (!user?.id) {
      throw new Error("User id required Please log in");
    }
    const result = await technicianService.updateProfile(user.id, payload);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Technician Profile Availability Updated Successfully",
      data: {
        result,
      },
    });
  },
);
const getBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user?.id) {
      throw new Error("User id required Please log in");
    }

    const result = await technicianService.getBooking(user.id);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your Bookings Retrieve Successfully",
      data: {
        result,
      },
    });
  },
);
const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const technicianProfileId = req.params?.id;

    if (!technicianProfileId) {
      throw new Error("technicianProfileId id required ");
    }

    const result = await technicianService.getProfile(
      technicianProfileId as string,
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Technician Profile Retrieve Successfully",
      data: {
        result,
      },
    });
  },
);

const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validateQuery = req.validatedQuery;

    const result = await technicianService.getAll(validateQuery);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "All Technician Profile Retrieve Successfully",
      data: {
        result,
      },
    });
  },
);
const verify = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { technicianId } = req.params;
    if (!technicianId) {
      throw new Error("Technician id required");
    }
    const user = req.user;
    if (user?.role !== "ADMIN") {
      throw new Error("Sorry only admin can change technician status");
    }
    const newStatus = req.body.status;

    const result = await technicianService.verify(
      technicianId as string,
      newStatus,
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: " Technician Profile updated Successfully",
      data: {
        result,
      },
    });
  },
);

// get all review by a technician
const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { technicianId } = req.params;
    if (!technicianId) {
      throw new Error("Sorry technician id required");
    }

    const result = await technicianService.getAllReviews(
      technicianId as string,req.validatedQuery
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Reviews Retrieve Successfully",
      data: {
        result,
      },
    });
  },
);

export const technicianController = {
  create,
  updateAvailability,
  updateProfile,
  getMe,
  getBookings,
  getProfile,
  getAll,
  verify,
  getAllReviews,
};
