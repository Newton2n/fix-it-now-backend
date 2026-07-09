import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import {
  TUserUpdatePasswordPayload,
  TUserUpdatePayload,
} from "./user.interface";
import config from "../../config";

const update = async (userId: string, payload: TUserUpdatePayload) => {
  const updateTransaction = await prisma.$transaction(async (tx) => {
    const userExists = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });

    const update = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        ...payload,
      },
      omit: {
        password: true,
      },
    });
    return update;
  });
  return updateTransaction
};
const updatePassword = async (
  userId: string,
  payload: TUserUpdatePasswordPayload,
) => {
  const passwordTransaction = await prisma.$transaction(async (tx) => {
    const userExists = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    const matchPassword =await bcrypt.compare(
      payload.oldPassword,
      userExists.password,
    );

    if (!matchPassword) {
      throw new Error("Sorry Password Not Matched");
    }

    const newPasswordHash = await bcrypt.hash(
      payload.newPassword,
      Number(config.bcrypt_salt_rounds),
    );

    const update = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newPasswordHash,
      },
      omit: {
        password: true,
      },
    });
    return update;
  });
  return passwordTransaction;
};

export const userService = {
  update,
  updatePassword,
};
