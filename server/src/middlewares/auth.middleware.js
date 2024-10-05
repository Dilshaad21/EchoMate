import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) throw new ApiError(401, "User not Authorized");

  const decodedAccessToken = await jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );

  if (!decodedAccessToken) throw new ApiError(401, "User not Authorized");
  req.username = decodedAccessToken.username;
  req.id = decodedAccessToken.id;
  next();
});

export { verifyJwt };
