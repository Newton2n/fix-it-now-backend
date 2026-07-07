import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { bookingService } from "./booking.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log("user in req", user);
    if (!user?.id) {
      throw new Error("User id required please log in");
    }
    const payload = req.body;
    const result = await bookingService.create(user.id, payload);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  },
);
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log("user in req", user);
    if (!user?.id) {
      throw new Error("User id required please log in");
    }
    const result = await bookingService.getAll(user.id);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "All Booking retrieved successfully",
      data: { bookings: result },
    });
  },
);
const getDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const bookingController = {
  create,
  getAll,
  getDetails,
  update,
};
