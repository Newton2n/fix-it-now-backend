import { prisma } from "../../lib/prisma";
import {
  TCreateCategoryPayload,
  TUpdateCategoryPayload,
} from "./category.interface";
import { updateCategorySchema } from "./category.schema";

const getAll = async () => {
  const result = await prisma.category.findMany();
  return result;
};
const create = async (payload: TCreateCategoryPayload) => {
  const category = await prisma.category.create({
    data: {
      ...payload,
    },
  });
  return category;
};
const update = async (categoryId: string, payload: TUpdateCategoryPayload) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  const update = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      ...payload,
    },
  });
  return update;
};
const remove = async (categoryId: string) => {
  const isCategoryExist = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  const remove = await prisma.category.delete({
    where: { id: categoryId },
  });

  return {
    name: isCategoryExist.name,
  };
};

export const categoryService = {
  getAll,
  create,
  update,
  remove,
};
