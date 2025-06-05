import { Router } from "express";
import {
  createAdmin,
  signIn,
  signOut,
  signUp,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);
authRouter.post("/create-admin", createAdmin);

export default authRouter;
