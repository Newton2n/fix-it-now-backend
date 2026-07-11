import { ServiceWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  TCreateServicePayload,
  TSearchFilters,
  TUpdateServicePayload,
} from "./service.interface";

const getAll = async (queryPayload: TSearchFilters) => {
  const {
    search,
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
    isAvailable = "true",
    sortBy,
    sortOrder,
  } = queryPayload;

  const itemPerPage = limit;
  const skip = (page - 1) * itemPerPage;

  const whereClause: ServiceWhereInput = {};

  // Search
  if (search) {
    whereClause.OR = [
      {
        title: {
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

  // Category Filter
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  // Price Filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};

    if (minPrice !== undefined) {
      whereClause.price.gte = minPrice;
    }

    if (maxPrice !== undefined) {
      whereClause.price.lte = maxPrice;
    }
  }

  // Sort
  const orderBy =
    sortBy === "price" ? { price: sortOrder } : { createdAt: sortOrder };

  if (isAvailable !== "true" && isAvailable !== "false") {
    throw new Error("Is available field can be true or false");
  }

  // default isAvailable
  if (isAvailable === "false") {
    whereClause.isAvailable = false;
  } else if (isAvailable === "true") {
    whereClause.isAvailable = true;
  }

  // Total count
  const total = await prisma.service.count({
    where: whereClause,
  });

  // Get services
  const services = await prisma.service.findMany({
    where: { AND: whereClause },
    orderBy,
    skip,
    take: itemPerPage,
  });

  return {
    meta: {
      currentPage:page,
      limit: itemPerPage,
      totalRow: total,
      totalPage: Math.ceil(total / itemPerPage),
    },
    data: services,
  };
};

// get all service by technician by id
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

// get by id
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

//create service
const create = async (userId: string, payload: TCreateServicePayload) => {
  const isTechnicianProfileExist =
    await prisma.technicianProfile.findUniqueOrThrow({
      where: {
        userId: userId,
      },
    });
  if (isTechnicianProfileExist.status !== "VERIFIED") {
    throw new Error("Technician is not verified yet");
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

//update service
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

  const update = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: {
      ...payload,
      technicianId: isTechnicianProfileExist.id,
    },
  });

  return update;
};

//remove service
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

// get all review by single service
const getAllReviews = async (serviceId: string) => {
  const reviews = await prisma.review.findMany({
    where: {
      booking: {
        serviceId: serviceId,
      },
    },
  });
  return reviews;
};

export const serviceService = {
  getAll,
  getById,
  create,
  update,
  remove,
  getAllByTechnicianId,
  getAllReviews,
};
