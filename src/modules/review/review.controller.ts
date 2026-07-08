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
    const { reviewId } = req.params;
    if (!reviewId) {
      throw new Error("Sorry review id required");
    }

    const payload = req.body;
    const result = await reviewService.update(
      user?.id,
      reviewId as string,
      payload,
    );
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
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in ");
    }

    const { id } = req.params;
    if (!id) {
      throw new Error("Sorry review id required");
    }

    const userRole = user.role;
    const result = await reviewService.remove(user?.id, userRole, id as string);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Review deleted successfully",
      data: {
        result,
      },
    });
  },
);
const getAllByMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in ");
    }
    const result = await reviewService.getAllMy(user?.id);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "All review retrieved successfully",
      data: {
        result,
      },
    });
  },
);

export const reviewController = {
  create,
  getById,
  update,
  remove,
  getAllByMe,
};
