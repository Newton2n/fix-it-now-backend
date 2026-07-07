import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { de } from "zod/locales";

const getAll = catchAsync(
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

export const categoryController = {
  getAll,
  create,
  update,
  remove,
};
