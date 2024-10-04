import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Listening at PORT", PORT);
    });
  })
  .catch((err) => {
    console.log(`\nFailed to connect to mongodDB .Error: ${err}`);
  });
