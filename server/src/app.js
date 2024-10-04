import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get("/test", (req, res) => {
  console.log("Connected with client URL", process.env.CLIENT_URL);
  res.send(process.env.CLIENT_URL);
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);

  res.send("Fetched username");
});

export default app;
