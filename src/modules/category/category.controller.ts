import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { categoryService } from "./category.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {},
);
const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.create(payload);

    sendSuccessResponse(res,{
        statusCode:StatusCodes.CREATED,
        message :"Category created Successfully",
        data :{
            result
        }
    })
  },
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
