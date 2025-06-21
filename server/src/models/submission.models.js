import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		problemId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Problem",
			required: true,
		},
		code: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			enum: ["cpp", "python", "java", "javascript"],
			required: true,
		},
		status: {
			type: String,
			enum: ["AC", "WA", "TLE", "RE", "CE", "Pending"],
			default: "Pending",
		},
		output: {
			type: String,
			default: "",
		},
		executionTime: {
			type: String,
			default: "",
		},
		memoryUsed: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
