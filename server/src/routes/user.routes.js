import { Router } from "express";
import { getUserByUsername, getCurrentUserInfo, loginUser, logoutUser, registerUser, checkLogin } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verifyUser").get(verifyJWT, (req, res) => {
	res.status(200).send(new ApiResponse(200, req.user, "JWT middleware verified"));
});

router.route("/logout").get(verifyJWT, logoutUser);

router.route("/info").get(verifyJWT, getCurrentUserInfo);

router.route("/userinfo/:username").get(getUserByUsername);

router.route("/checkLogin").get(verifyJWT, checkLogin);

export default router;
