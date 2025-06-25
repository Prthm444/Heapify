import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import Problem from "../models/problem.models.js";
import {
	AddNewProblem,
	getAllInputsAndOutputs,
	ListProblems,
} from "../controllers/problem.controllers.js";
const router = Router();

router.route("/new").post(verifyJWT, AddNewProblem);
router.route("/list").get(verifyJWT, ListProblems);
router.route("/testcases/:problemId").get(getAllInputsAndOutputs);
export default router;
