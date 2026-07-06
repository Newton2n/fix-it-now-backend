import { prisma } from "../../lib/prisma";
import {
  TLoginPayload,
  TRegistrationPayload,
} from "./auth.interface";
import bcrypt from "bcryptjs";
import config from "../../config";
import { Prisma } from "../../../generated/prisma/client";
import { jwtUtils } from "../../utils/jwt";

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

const login = async (payload: TLoginPayload) => {
  const where = {} as Prisma.UserWhereUniqueInput;

  if (payload.email) {
    where.email = payload.email;
  } else if (payload.phoneNumber) {
    where.phoneNumber = payload.phoneNumber;
  } else {
    throw new Error("At least email or phone number field is required");
  }

  const user = await prisma.user.findUniqueOrThrow({
    where,
  });

  const checkPassword = await bcrypt.compare(payload.password, user.password);
  if (!checkPassword) {
    throw new Error("Invalid Credential");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.roles,
  };

  console.log("jwt payload", jwtPayload);
  // jwt access token generate
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );

  //jwt refreshToken generate
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );

  return {
    accessToken,
    refreshToken,
    jwtPayload,
  };
};
const getMe = async () => {};
const refreshToken = async () => {};

export const authService = { register, login, getMe, refreshToken };
