import express from "express";
import { register, login, updateProfile } from "../controllers/user.controller.js"; // Import `login`
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login); // `login` is now correctly imported
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;
