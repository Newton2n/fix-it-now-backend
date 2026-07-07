import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catch-async";
import { serviceService } from "./service.service";
import { sendSuccessResponse } from "../../utils/response";
import { StatusCodes } from "http-status-codes";
const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.getAll();

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Services retrieved Successfully",
      data: {
        result,
      },
    });
  },
);
const getAllByTechnicianId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id) {
      throw new Error("Technician id required");
    }
    const result = await serviceService.getAllByTechnicianId(id as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Services retrieved Successfully",
      data: {
        result,
      },
    });
  },
);
const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      throw new Error("Service id required");
    }
    const result = await serviceService.getById(id as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Service retrieved Successfully",
      data: {
        result,
      },
    });
  },
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
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const serviceId = req.params?.id;
    const payload = req.body;
    if (!user?.id) {
      throw new Error("User id required Please log in");
    }
    if (!serviceId) {
      throw new Error("Service id required");
    }

    const result = await serviceService.update(
      user?.id,
      serviceId as string,
      payload,
    );

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Service updated Successfully",
      data: {
        result,
      },
    });
  },
);
const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const serviceId = req.params?.id;
    if (!user?.id) {
      throw new Error("User id required Please log in");
    }
    if (!serviceId) {
      throw new Error("Service id required");
    }

    const result = await serviceService.remove(user.id, serviceId as string);

    sendSuccessResponse(res, {
      statusCode: StatusCodes.OK,
      message: "Service deleted Successfully",
      data: {
        result,
      },
    });
  },
);

export const serviceController = {
  getAll,
  getById,
  create,
  update,
  remove,
  getAllByTechnicianId,
};
