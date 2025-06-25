import Submission from "../models/submission.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/async.utils.js";

export const AddNewSubmission = asyncHandler(async (req, res) => {
	const { output } = req.body;
	res.status(200).json(new ApiResponse(200, { output }));
});
