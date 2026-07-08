import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { paymentService } from "./payment.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const checkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      throw new Error("Sorry you are not log in please log in");
    }

    const { bookingId } = req.body;

    const result = await paymentService.checkoutSession(
      user.id,
      user.email,
      bookingId,
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Check Out Session Created",
      data: result,
    });
  },
);

const webhookHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const signature = req.headers["stripe-signature"];
    const result = await paymentService.webhookHandler(
      req.body,
      signature as string,
    );
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Payment done",
      data: result,
    });
  },
);

const getAllByLogInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user?.id) {
      throw new Error("Sorry user id required please log in");
    }
    const result = await paymentService.getAllByLogInUser(user.id as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Payment history Retrieve successfully",
      data: {
        result,
      },
    });
  },
);
const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user?.id) {
      throw new Error("Sorry user id required please log in");
    }
    const {paymentId} = req.params ;
    if(!paymentId){
      throw new Error("Sorry payment id required")
    }
    const result = await paymentService.getById(paymentId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Payment Details Retrieve successfully",
      data: {
        result,
      },
    });
  },
);

export const paymentController = {
  checkout,
  webhookHandler,
  getAllByLogInUser,getById
};
