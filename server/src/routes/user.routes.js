import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/verifyUser").get(verifyJWT, (req, res) => {
	res.status(200).send(
		new ApiResponse(200, req.user, "JWT middleware verified")
	);
});

export default router;
