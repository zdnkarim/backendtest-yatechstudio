import express from "express";
import dotenv from "dotenv";
dotenv.config();
import db from "./config/Database.js";
import router from "./routes/index.js";
import Users from "./models/Users.js";
import cookieParser from "cookie-parser";

const app = express();
const port = 3532;

try {
  await db.authenticate();
  console.log("database connected...");
  await Users.sync();
} catch (error) {
  console.error(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
