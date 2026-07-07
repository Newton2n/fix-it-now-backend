import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { serviceService } from "./service.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const serviceController = {
  getAll,
  getById,
  create,
  update,
  remove,
};
