import { prisma } from "../../lib/prisma";
import { TCreateCategoryPayload } from "./category.interface";

const getAll = async () => {};
const create = async (payload: TCreateCategoryPayload) => {
  const category = await prisma.category.create({
    data: {
      ...payload,
    },
  });
  return category;
};
const update = async () => {};
const remove = async () => {};

export const categoryService = {
  getAll,
  create,
  update,
  remove,
};
