import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { categoryService } from "./category.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedQuery = req.validatedQuery
    const result = await categoryService.getAll(validatedQuery);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Category Retrieve successfully",
      data: {
        result,
      },
    });
  },
);
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.create(payload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Category created Successfully",
      data: {
        result,
      },
    });
  },
);
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new Error("Category id required");
    }
    const payload = req.body;

    const result = await categoryService.update(id as string, payload);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Category updated Successfully",
      data: {
        result,
      },
    });
  },
);
const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new Error("Category id required");
    }
    const result =await categoryService.remove(id as string);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Category deleted Successfully",
      data: {
        result
      },
    });
  },
);

export const categoryController = {
  getAll,
  create,
  update,
  remove,
};
