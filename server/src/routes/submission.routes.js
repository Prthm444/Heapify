import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { AddNewSubmission } from "../controllers/submission.controllers.js";

const router=Router();

router.route("/new").post(AddNewSubmission)

export default router;