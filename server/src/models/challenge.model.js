import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
	{
		challengerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		opponentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		problemId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Problem",
			required: true,
		},
		status: {
			type: String,
			enum: ["Pending", "Completed"],
			default: "Pending",
		},
		challengerResult: {
			type: String,
			enum: ["AC", "WA", "TLE", "RE", "CE", "Pending"],
			default: "Pending",
		},
		opponentResult: {
			type: String,
			enum: ["AC", "WA", "TLE", "RE", "CE", "Pending"],
			default: "Pending",
		},
		winnerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
