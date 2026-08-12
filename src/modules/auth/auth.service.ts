import { prisma } from "../../lib/prisma";
import { TLoginPayload, TRegistrationPayload } from "./auth.interface";
import bcrypt from "bcryptjs";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { verifyGoogleToken } from "../../utils/google-verify";

//register user
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

//log in
const login = async (payload: TLoginPayload) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  if (user.status === "BLOCKED") {
    throw new Error("Sorry you are blocked contact support");
  }
  const checkPassword = await bcrypt.compare(payload.password, user?.password!);
  if (!checkPassword) {
    throw new Error("Invalid Credential");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

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

//get user
const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });
  return user;
};

//generate refresh token
const refreshToken = async (refreshToken: string) => {
  const verifyToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret!,
  );

  if (!verifyToken.data) {
    throw new Error(verifyToken.error);
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: verifyToken.data.id,
    },
    omit: {
      password: true,
    },
  });

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active. Please contact support");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in!,
  );

  return { accessToken, jwtPayload };
};

//log in via google
const google = async (idToken: string) => {

  let user = null;
  const userPayload = await verifyGoogleToken(idToken);
  if (!userPayload) {
    throw new Error("Google token verification failed");
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userPayload.email,
    },
  });

  if (!userPayload.name || !userPayload.email) {
    throw new Error("Email verification failed invalid email or name");
  }

  //register new user
  if (!isUserExist) {
    user = await prisma.user.create({
      data: {
        name: userPayload?.name,
        email: userPayload?.email,
        role: "CUSTOMER",
        authProvider: "GOOGLE",
        emailVerified: true,
        socialId: userPayload.sub,
        needPasswordChange: true,
      },
    });
  } else {
    //user exist
    if (isUserExist.role !== "CUSTOMER" && isUserExist.role !== "TECHNICIAN") {
      throw new Error("Sorry admin can not login via google");
    }
    if (isUserExist.status === "BLOCKED") {
      throw new Error("Sorry you are blocked contact support");
    }

    //update user
    if (!isUserExist.socialId) {
      user = await prisma.user.update({
        where: {
          id: isUserExist.id,
        },
        data: {
          emailVerified: true,
          socialId: userPayload.sub,
        },
      });
    } else {
      user = isUserExist;
    }
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

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
export const authService = { register, login, getMe, refreshToken, google };
