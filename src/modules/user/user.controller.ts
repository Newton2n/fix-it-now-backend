import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { userService } from "./user.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";;
const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user
    if(!user){
        throw new Error("User Not log in please log in")
    }

    const result = await userService.update(user.id as string,payload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "User Information Updated Successfully",
      data: result,
    });
  },
);
const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.params?.id;

    if (!userId) {
      throw new Error("User id required ");
    }

  

    const result = await userService.getUser(userId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "User Information Retrieved Successfully",
      data: result,
    });
  },
);
const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user
    if(!user){
        throw new Error("User Not log in please log in")
    }

    const result = await userService.updatePassword(user.id as string,payload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "User Password Updated Successfully",
      data: result,
    });
  },
);
const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = req.user
    if(!user){
        throw new Error("User Not log in please log in")
    }

    const result = await userService.setPassword(user.id as string,payload);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.CREATED,
      message: "User Password Updated Successfully",
      data: result,
    });
  },
);


export const userController = {
  update,
  updatePassword,
  getUser,
  setPassword
};
