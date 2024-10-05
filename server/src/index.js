import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import webSocketServer from "./wss.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log("Listening at PORT", PORT);
    });
    webSocketServer(server);
  })
  .catch((err) => {
    console.log(`\nFailed to connect to mongodDB .Error: ${err}`);
  });
