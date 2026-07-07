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

    if (user?.role !== "TECHNICIAN") {
      throw new Error(
        "Customer can not create technician profile please update",
      );
    }
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
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const technicianController = {
  create,
  updateAvailability,
  updateProfile,
  getMe,
  getBookings,
  getProfile,
};
