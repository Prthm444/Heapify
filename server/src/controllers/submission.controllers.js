import Submission from "../models/submission.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/async.utils.js";
import axios from "axios";
import { getInputOutputPairsByProblemId } from "./problem.controllers.js";
import Problem from "../models/problem.models.js";


export const AddNewSubmission = asyncHandler(async (req, res) => {
	const { language = "cpp", code, problemId } = req.body;
	if (!problemId) throw new ApiError(401, "Problem Id not given");
	const problem = await Problem.findById(problemId);
	if (!problem) throw new ApiError(404, "Problem Not Found");
	const ioPairs = await getInputOutputPairsByProblemId(problemId);
	const OJ_output = await axios.post("http://127.0.0.1:7000/run", {
		language,
		code,
		testcases: ioPairs,
	});
	const submission = await Submission.create({
		userId: req.user._id,
		problemId,
		code,
		language,
		status: OJ_output.data.verdict.result,
		result: OJ_output.data.results,
		executionTime: OJ_output.data.verdict.executionTime,
	});

	const newSubmission = Submission.findById(submission._id);
	if (!newSubmission) {
		throw new ApiError(500, "Could not submit to database");
	}
	res.status(200).json(new ApiResponse(200, OJ_output.data));
});
