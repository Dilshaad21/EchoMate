import express from "express";
import cors from "cors";
import { ApiError } from "./utils/ApiError.js";
import { User } from "./models/user.model.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { ApiResponse } from "./utils/ApiResponse.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { verifyJwt } from "./middlewares/auth.middleware.js";
import { Message } from "./models/message.model.js";

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

app.get(
  "/messages/:userId",
  verifyJwt,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) throw new ApiError(400, "No user Id given");
    const senderUserId = req.id;
    let messages = await Message.find({
      sender: { $in: [senderUserId, userId] },
      receiver: { $in: [senderUserId, userId] },
    }).sort({ createdAt: 1 });

    // Rename `_id` to `id` for each message
    messages = messages.map((message) => {
      return {
        ...message.toObject(), // Convert Mongoose document to plain JS object
        id: message._id,
        _id: undefined, // Optionally remove the original _id field
      };
    });

    res
      .status(200)
      .json(new ApiResponse(200, messages, "Sent available list of messages"));
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
