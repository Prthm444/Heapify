import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
	acceptFriendRequest,
	getPendingFriendRequests,
	getStatus,
	rejectFriendRequest,
	sendFriendRequest,
} from "../controllers/friendRequest.controllers.js";
//import { verify } from "jsonwebtoken";

const router = Router();

router.route("/sendrequest/:username").get(verifyJWT, sendFriendRequest);
router.route("/getfriendrequests").get(verifyJWT, getPendingFriendRequests);
router.route("/accept/:requestId").get(verifyJWT, acceptFriendRequest);
router.route("/reject/:requestId").get(verifyJWT, rejectFriendRequest);
router.route("/status/:username").get(verifyJWT, getStatus);
export default router;
