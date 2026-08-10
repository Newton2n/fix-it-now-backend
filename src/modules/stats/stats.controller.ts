import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
import { statsService } from "./stats.service";
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const queryPayload = req.validatedQuery;

    const result = await statsService.getAll(queryPayload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "App stats summary retrieve Successfully",
      data: {
        result,
      },
    });
  },
);

export const statsController = {getAll}