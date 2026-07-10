import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { adminService } from "./admin.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUser();

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "All user Retrieved successfully",
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
      message: "Category Retrieve successfully",
      data: {
        result,
      },
    });
  },
);
const getAllBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllBooking(req.validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "All Bookings Retrieved successfully",
      data: {
        result,
      },
    });
  },
);
const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedQuery = req.validatedQuery;
    const result = await adminService.getAllCategory(validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Category Retrieve successfully",
      data: {
        result,
      },
    });
  },
);
const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllReviews();

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "All reviews retrieve successfully",
      data: {
        result,
      },
    });
  },
);

export const adminController = {
  getAllUser,
  updateUserStatus,
  getAllBooking,
  getAllCategory,
  getAllReviews,
};
