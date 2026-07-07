import { prisma } from "../../lib/prisma";
import {
  TCreateServicePayload,
  TUpdateServicePayload,
} from "./service.interface";

const getAll = async () => {};
const getById = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });
  if (!service) {
    throw new Error("Service does not exist");
  }

  return service;
};
const create = async (userId: string, payload: TCreateServicePayload) => {
  const isTechnicianProfileExist =
    await prisma.technicianProfile.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });

  //category exist check
  await prisma.category.findFirstOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const createService = await prisma.service.create({
    data: {
      ...payload,
      technicianId: isTechnicianProfileExist.id,
    },
  });

  return createService;
};
const update = async (
  userId: string,
  serviceId: string,
  payload: TUpdateServicePayload,
) => {
  const isTechnicianProfileExist =
    await prisma.technicianProfile.findFirstOrThrow({
      where: {
        userId: userId,
      },
    });

  //category exist check
  await prisma.category.findFirstOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const service = await prisma.service.findFirstOrThrow({
    where: {
      id: serviceId,
    },
  });

  //owner check
  if (service.technicianId !== isTechnicianProfileExist.id) {
    throw new Error("You cannot edit another technician's service");
  }

  const updateService = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      ...payload,
      technicianId: isTechnicianProfileExist.id,
    },
  });

  return updateService;
};
const remove = async () => {};

export const serviceService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
