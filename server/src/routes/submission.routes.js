import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { AddNewSubmission, getAllSubmissions, RunCustomInput } from "../controllers/submission.controllers.js";

const router = Router();

router.route("/new").post(verifyJWT, AddNewSubmission);
router.route("/all").get(verifyJWT, getAllSubmissions);
router.route("/run").post(verifyJWT, RunCustomInput);

export default router;
