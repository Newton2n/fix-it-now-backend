import { prisma } from "../../lib/prisma";
import { TRegistrationPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import config from "../../config";
const register = async (payload: TRegistrationPayload) => {
  const hashPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );
  const { password, ...restItem } = payload;

  const result = await prisma.user.create({
    data: {
      password: hashPassword,
      ...restItem,
    },
    omit: {
      password: true,
    },
  });

  return result;
};




export const authService = {register}