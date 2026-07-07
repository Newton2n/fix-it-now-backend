import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { serviceService } from "./service.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const payload = req.body;
    if (!user?.id) {
      throw new Error("User id required Please log in");
    }

    const result = await serviceService.create(user?.id, payload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "Service created Successfully",
      data: {
        result,
      },
    });
  },
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
