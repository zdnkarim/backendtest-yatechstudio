import express from "express";
import {
  getMe,
  getUsers,
  login,
  logout,
  register,
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);

router.get("/token", refreshToken);

router.get("/me", verifyToken, getMe);

router.post("/users", register);

router.post("/login", login);

router.delete("/logout", logout);

export default router;
