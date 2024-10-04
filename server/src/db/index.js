import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URL}/${DB_NAME}`
    );
    console.log(
      `\nSuccessfully connected to MongoDB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Failed to Connect to MongoDB URL", error);
    process.exit(1);
  }
};

export default connectDB;
