import Submission from "../models/submission.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/async.utils.js";
import axios from "axios";
import { getInputOutputPairsByProblemId } from "./problem.controllers.js";
import Problem from "../models/problem.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/Error.utils.js";

export const AddNewSubmission = asyncHandler(async (req, res) => {
	const { language = "cpp", code, problemId } = req.body;
	//console.log("hello---------",code)
	if (!problemId) throw new ApiError(401, "Problem Id not given");
	const problem = await Problem.findById(problemId);
	if (!problem) throw new ApiError(404, "Problem Not Found");
	const ioPairs = await getInputOutputPairsByProblemId(problemId);
	const OJ_output = await axios.post(`http://${process.env.OJ_SERVER_IP}:7000/run`, {
		language,
		code,
		testcases: ioPairs,
	});
	//if (language === "py") language = "python";
	const submission = await Submission.create({
		userId: req.user._id,
		problemId,
		code,
		language: language === "py" ? "python" : language,
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
		.select("problemId status createdAt language executionTime code") // Only select essential fields
		.populate("problemId", "title")
		.lean();

	res.status(200).json(new ApiResponse(200, submissions, "All submissions fetched successfully"));
});

export const RunCustomInput = asyncHandler(async (req, res) => {
	const { code, language, customInput } = req.body;
	//console.log(code);
	try {
		const result = await axios.post(`http://${process.env.OJ_SERVER_IP}:7000/customrun`, { code, language, customInput });
		res.status(200).json(new ApiResponse(200, result.data, "Input ran successfully"));
		//console.log(result.data);
	} catch (error) {
		//console.log("this is it :", error);
		throw new ApiError(401, "OJ server error");
	}
});
