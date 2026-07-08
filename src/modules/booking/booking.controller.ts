import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { bookingService } from "./booking.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { BookingStatus } from "../../../generated/prisma/enums";
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new Error("Booking id required");
    }
    const result = await bookingService.getDetails(id as string);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Booking retrieved successfully",
      data: { booking: result },
    });
  },
);
const updateByTechnician = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in");
    }
    const { id } = req.params;
    if (!id) {
      throw new Error("Booking id required");
    }
    const { status } = req.body;
    if (!status || !Object.values(BookingStatus).includes(status)) {
      throw new Error("Valid booking status required");
    }
    const result = await bookingService.updateStatusByTechnician(
      id as string,
      user.id,
      status,
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Booking status updated successfully",
      data: { booking: result },
    });
  },
);

export const bookingController = {
  create,
  getAll,
  getDetails,
  updateByTechnician,
};
