import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema(
	{
		fromUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		toUserId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["Pending", "Accepted", "Rejected"],
			default: "Pending",
		},
	},
	{
		timestamps: true,
	}
);

const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
