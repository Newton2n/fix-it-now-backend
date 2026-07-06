import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secretKey: string,
  expire: string,
) => {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: expire,
  } as SignOptions);

  return token;
};

export const jwtUtils = { createToken };
