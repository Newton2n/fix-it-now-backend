import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { technicianService } from "./technician.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";

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
    const payload = req.body
    
    console.log("payload",payload);
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
   

    const result = await technicianService.getAll();
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your Technician Profile Retrieve Successfully",
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
  getAll
};
