import express from "express";
import cors from "cors";
import { ApiError } from "./utils/ApiError.js";
import { User } from "./models/user.model.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { verifyJwt } from "./middlewares/auth.middleware.js";

const app = express();
const cookieOptions = {
  httpOnly: true,
  secure: true,
};

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get(
  "/profile",
  verifyJwt,
  asyncHandler(async (req, res) => {
    const { username, id } = req;
    res.json(new ApiResponse(200, { username, id }));
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (!existingUser) throw new ApiError(400, "User does not exist");

    if (!existingUser.isPasswordCorrect(password))
      throw new ApiError(400, "Password is incorrect");

    const accessToken = await existingUser.generateAccessToken();

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, user: existingUser },
          "Successfully logged in as a user!!"
        )
      );
  })
);

app.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      throw new ApiError(400, "Username and Password are required");

    const user = await User.create({
      username,
      password,
    });
    const accessToken = await user.generateAccessToken();
    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) throw new ApiError(500, "User not created");

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, user: createdUser },
          "Successfully created a user!!"
        )
      );
  })
);

export default app;
