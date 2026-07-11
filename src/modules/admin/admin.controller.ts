import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { adminService } from "./admin.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const findUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.findUser(req.validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Users Retrieved successfully",
      data: {
        result,
      },
    });
  },
);
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("Sorry user id required");
    }
    const status = req.body.status;
    const result = await adminService.updateUserStatus(id as string, status);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Category updated successfully",
      data: {
        result,
      },
    });
  },
);
const findBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.findBooking(req.validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Bookings Retrieved successfully",
      data: {
        result,
      },
    });
  },
);
const findCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedQuery = req.validatedQuery;
    const result = await adminService.findCategory(validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Categories Retrieve successfully",
      data: {
        result,
      },
    });
  },
);
const findReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.findReviews(req.validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Reviews retrieve successfully",
      data: {
        result,
      },
    });
  },
);
const findPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.findPayments(req.validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Payments retrieve successfully",
      data: {
        result,
      },
    });
  },
);

export const adminController = {
  findUser,
  updateUserStatus,
  findBooking,
  findCategory,
  findReviews,
  findPayments
};
