import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { bookingService } from "./booking.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes} from "http-status-codes";
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const getDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);

export const bookingController = {
  create,
  getAll,
  getDetails,
  update,
};
