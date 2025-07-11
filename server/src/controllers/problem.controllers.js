import Problem from "../models/problem.models.js";
import { GetAiResposne } from "../utils/AiResponse.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/async.utils.js";
import { ApiError } from "../utils/Error.utils.js";

export const AddNewProblem = asyncHandler(async (req, res) => {
	const { title, description, difficulty, tags, inputFormat, outputFormat, constraints, examples, testCases } = req.body;
	//console.log("adding problem called : ", req.body);

	if (
		[title, description, difficulty, inputFormat, outputFormat, constraints].some((fields) => {
			fields?.trim() === "";
		})
	) {
		throw new ApiError(400, "All info required");
	}

	const existingProb = await Problem.findOne({ title: title.toLowerCase() });

	if (existingProb) {
		throw new ApiError(401, "Problem with the same title already exists");
	}

	const problem = await Problem.create({
		title: title.toLowerCase(),
		description,
		difficulty,
		tags,
		inputFormat,
		outputFormat,
		constraints,
		examples,
		testCases,
		createdBy: req.user,
	});

	const createdProblem = await Problem.findById(problem._id).select("-testCases -examples, -inputFormat -outputFormat  ");

	if (!createdProblem) {
		throw new ApiError(500, "Something went Wrong during creating new problem");
	}

	return res.status(200).json(new ApiResponse(200, { title, description }, "Problem Created successfully"));
});

export const ListProblems = asyncHandler(async (req, res) => {
	const problems = await Problem.find({});
	//console.log("user is :", req.user);
	if (!problems) {
		return res.status(201).json(new ApiResponse(201, "No Problems Available"));
	}

	return res.status(200).json(new ApiResponse(200, problems, "All problems retrieved successfully"));
});

export const getInputOutputPairsByProblemId = async (problemId) => {
	const problem = await Problem.findById(problemId);
	if (!problem) {
		throw new ApiError(404, "Problem not found");
	}
	return problem.testCases.map((tc) => ({
		input: tc.input,
		output: tc.output,
	}));
};

export const getAllInputsAndOutputs = asyncHandler(async (req, res) => {
	const problemId = req.params.problemId;
	const ioPairs = await getInputOutputPairsByProblemId(problemId);
	res.status(200).json({ ioPairs });
});

export const getProblemById = asyncHandler(async (req, res) => {
	const problemId = req.params.problemId;
	const problem = await Problem.findById(problemId);
	if (!problem) {
		throw new ApiError(404, "Problem not found");
	}
	res.status(200).json(new ApiResponse(200, problem, "problem found"));
});

export const GetAiCodeReview = asyncHandler(async (req, res) => {
	const { code, problem } = req.body;

	if (!code || !problem) {
		throw new ApiError(400, "Missing required fields: code, problem, or submission");
	}

	const TIMEOUT_MS = 15000;

	// Timeout promise
	const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI response timed out after 15 seconds")), TIMEOUT_MS));

	try {
		// Run the AI response function with timeout
		const response = await Promise.race([GetAiResposne(code, problem), timeoutPromise]);

		if (!response) {
			throw new ApiError(500, "AI response generation failed");
		}

		return res.status(200).json(new ApiResponse(200, { review: response }, "AI review generated successfully"));
	} catch (error) {
		console.error("[AI Review Error]:", error.message);
		throw new ApiError(500, error.message || "Internal Server Error while generating AI review");
	}
});
