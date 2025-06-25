const { mongoose } = require("mongoose");

const exampleSchema = new mongoose.Schema({
	input: { type: String, required: true },
	output: { type: String, required: true },
	explanation: { type: String },
});

const testCaseSchema = new mongoose.Schema({
	input: { type: String, required: true },
	output: { type: String, required: true },
	isPublic: { type: Boolean, default: false },
});

const problemSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
		},
		difficulty: {
			type: String,
			enum: ["Easy", "Medium", "Hard"],
			default: "Easy",
		},
		tags: {
			type: [String],
			default: [],
		},
		inputFormat: {
			type: String,
			required: true,
		},
		outputFormat: {
			type: String,
			required: true,
		},
		constraints: {
			type: String,
			required: true,
		},
		examples: {
			type: [exampleSchema],
			default: [],
		},
		testCases: {
			type: [testCaseSchema],
			default: [],
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Problem = mongoose.model("Problem", problemSchema);
module.exports = { Problem };
