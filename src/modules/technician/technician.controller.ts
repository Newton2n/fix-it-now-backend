import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { technicianService } from "./technician.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";

const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
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

export const technicianController = {
  create,
  updateAvailability,
  updateProfile,
  getMe,
  getBookings,
};
