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

const verifyToken = (token: string, secretKey: string) => {
   try {
    console.log(token, secretKey);

    const verify = jwt.verify(token, secretKey);

    console.log("verify user", verify);
    return {
      success: true,
      data: verify as JwtPayload,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
export const jwtUtils = { createToken, verifyToken };
