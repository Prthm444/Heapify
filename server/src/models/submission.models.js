import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
	input: {
		type: String,
		required: true,
	},
	expectedOutput: {
		type: String,
		required: true,
	},
	actualOutput: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		enum: ["Passed", "Failed", "Error"],
		required: true,
	},
	executionTime: {
		type: Number, // in milliseconds
		required: true,
	},
});

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
			enum: ["AC", "RJ", "TLE", "RE", "CE", "Pending"],
			default: "Pending",
		},
		result: [resultSchema],
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
