import { CategoryWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  TCategorySearchFilters,
  TCreateCategoryPayload,
  TUpdateCategoryPayload,
} from "./category.interface";

const getAll = async (queryPayload: TCategorySearchFilters) => {
  const { limit, page, sortBy, sortOrder, search } = queryPayload;

  const itemPerPage = limit;
  const skip = (page - 1) * itemPerPage;

  const whereClause: CategoryWhereInput = {};
  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const orderBy =
    sortBy === "createdAt" ? { createdAt: sortOrder } : { name: sortOrder };
  const categoriesCount = await prisma.category.count({
    where: {
      AND: whereClause,
    },
  });
  const categories = await prisma.category.findMany({
    where: {
      AND: whereClause,
    },
    skip: skip,
    take: itemPerPage,
    orderBy,
  });
  return {
    meta: {
      page: page,
      limit: itemPerPage,
      totalRow: categoriesCount,
      totalPage: Math.ceil(categoriesCount / itemPerPage),
    },
    data: categories,
  };
};


// create category
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
