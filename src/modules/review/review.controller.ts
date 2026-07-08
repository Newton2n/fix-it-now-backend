import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { reviewService } from "./review.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in ");
    }

    const payload = req.body;
    const result = await reviewService.create(user?.id, payload);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Review created successfully",
      data: {
        result,
      },
    });
  },
);
const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new Error("Sorry review id required");
    }

    const result = await reviewService.getById(id as string);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Review retrieved successfully",
      data: {
        result,
      },
    });
  },
);
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in ");
    }

    const payload = req.body;
    const result = await reviewService.update(user?.id, payload);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Review updated successfully",
      data: {
        result,
      },
    });
  },
);
const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getAllByCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const reviewController = {
  create,
  getById,
  update,
  remove,
  getAllByCustomer,
};
