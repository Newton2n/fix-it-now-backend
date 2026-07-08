import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { paymentService } from "./payment.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const checkout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
     const user = req.user
     if(!user){
      throw new Error("Sorry you are not log in please log in")
     }

     const {bookingId} = req.body ;

    const result = await paymentService.checkoutSession(user.id,user.email,bookingId);
    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Check Out Session Created",
      data: result,
    });
  
  }
);


export const paymentController ={
checkout
}