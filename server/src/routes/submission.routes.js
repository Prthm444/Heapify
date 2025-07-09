import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { AddNewSubmission, getAllSubmissions } from "../controllers/submission.controllers.js";

const router = Router();

router.route("/new").post(verifyJWT, AddNewSubmission);
router.route("/all").get(verifyJWT, getAllSubmissions);

export default router;
