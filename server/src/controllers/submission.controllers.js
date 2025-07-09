import Submission from "../models/submission.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/async.utils.js";
import axios from "axios";
import { getInputOutputPairsByProblemId } from "./problem.controllers.js";
import Problem from "../models/problem.models.js";
import { User } from "../models/user.models.js";

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

	// Update user's stats
	const updateOps = {
		$addToSet: {
			"stats.Submissions": submission._id,
			"stats.languagesUsed": language,
		},
	};

	if (submission.status === "AC") {
		updateOps.$addToSet["stats.SolvedProblems"] = problemId;
	}

	await User.findByIdAndUpdate(req.user._id, updateOps, { new: true });

	// Recalculate accuracy
	const allSubmissions = await Submission.find({ userId: req.user._id });
	const total = allSubmissions.length;
	const passed = allSubmissions.filter((s) => s.status === "AC").length;
	const newAccuracy = total > 0 ? (passed / total) * 100 : 0;

	await User.findByIdAndUpdate(req.user._id, {
		"stats.accuracy": newAccuracy,
	});

	res.status(200).json(new ApiResponse(200, OJ_output.data));
});

export const getAllSubmissions = asyncHandler(async (req, res) => {
	const submissions = await Submission.find({ userId: req.user._id })
		.sort({ createdAt: -1 })
		.select("problemId status createdAt language executionTime") // Only select essential fields
		.populate("problemId", "title")
		.lean();

	res.status(200).json(new ApiResponse(200, submissions, "All submissions fetched successfully"));
});
