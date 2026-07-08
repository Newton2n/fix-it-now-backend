import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { categoryService } from "./category.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const reviewController = {
  create,
  getById,
  update,
  remove,
};
