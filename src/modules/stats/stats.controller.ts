import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { statsService } from "./stats.service";
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const queryPayload = req.validatedQuery;

    const result = await statsService.getAll();

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "App stats summary retrieve Successfully",
      data: {
        result,
      },
    });
  },
);
const admin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in");
    }

    const result = await statsService.admin();

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Platform stats retrieve Successfully",
      data: {
        result,
      },
    });
  },
);

const technician = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in");
    }
    const result = await statsService.technician(user?.id);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your stats retrieve Successfully",
      data: {
        result,
      },
    });
  },
);
const customer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user?.id) {
      throw new Error("User id required please log in");
    }
    const result = await statsService.customer(user?.id);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Your stats retrieve Successfully",
      data: {
        result,
      },
    });
  },
);

export const statsController = { getAll, admin,customer ,technician};
