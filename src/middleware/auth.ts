import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catch-async";
import { UserRole } from "../../generated/prisma/enums";
import { jwtUtils } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
      };
    }
  }
}


const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // get access token via header ,cookies
    const accessToken = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!accessToken) {
      throw new Error(
        "You are not logged in. Please log in to access this resource.",
      );
    }

    //verify access token
    const verifyAccessToken = jwtUtils.verifyToken(
      accessToken,
      config.jwt_access_secret!,
    );

    if (!verifyAccessToken.success) {
      throw new Error(verifyAccessToken.error);
    }

    const { email, name, id, role } = verifyAccessToken.data as JwtPayload;

    console.log(email, name, id, role);

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden. You don't have permission to access this resource.",
      );
    }

    // check database to ensure the user
    const user = await prisma.user.findUnique({
      where: {
        id: id,
        email: email,
        role: role,
      },
    });

    if (!user) {
      throw new Error("User not found. Please log in in again.");
    }

    if (user.status !== "ACTIVE") {
      throw new Error(
        "Your account has been blocked or inactive. Please contact support.",
      );
    }

    req.user = {
      id: id,
      name: name,
      email: email,
      role: role,
    };

    next();
  });
};
export const authMiddleware = { auth };
