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

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { accessToken, refreshToken, jwtPayload } =
      await authService.login(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "User Log in successfully",
      data: {
        user: jwtPayload,
      },
    });
  },
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
export const authController = {
  register,
  login,
  getMe,
  refreshToken,
};
