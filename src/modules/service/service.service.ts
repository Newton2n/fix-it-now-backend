import { prisma } from "../../lib/prisma";
import {
  TCreateServicePayload,
  TUpdateServicePayload,
} from "./service.interface";

const getAll = async () => {
  const service = await prisma.service.findMany();
  return service;
};
const getAllByTechnicianId = async (technicianId: string) => {
  const isTechnicianProfileExist =
    await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        id: technicianId,
      },
    });

  const service = await prisma.service.findMany({
    where: {
      technicianId: technicianId,
    },
  });
  return service;
};
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
    await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });
  if (isTechnicianProfileExist.status !== "VERIFIED") {
    throw new Error("Technician is not verified yet" );
  }
  //category exist check
  await prisma.category.findUniqueOrThrow({
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
    await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });

  //category exist check
  await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const service = await prisma.service.findUniqueOrThrow({
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
const remove = async (userId: string, serviceId: string) => {
  const isTechnicianProfileExist =
    await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });

  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
  });

  //owner check
  if (service.technicianId !== isTechnicianProfileExist.id) {
    throw new Error("You cannot delete another technician's service");
  }

  const remove = await prisma.service.delete({
    where: {
      id: serviceId,
    },
  });

  return remove;
};

export const serviceService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getAllByTechnicianId,
};
