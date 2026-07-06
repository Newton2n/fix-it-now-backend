import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { authService } from "./auth.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await authService.register(payload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "User Created Successfully",
      data: result,
    });
  },
);




export const authController = {
  register,login
};
