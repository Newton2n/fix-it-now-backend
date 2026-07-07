import { prisma } from "../../lib/prisma";
import { TCreateServicePayload } from "./service.interface";

const getAll = async () => {};
const getById = async () => {};
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
const update = async () => {};
const remove = async () => {};

export const serviceService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
