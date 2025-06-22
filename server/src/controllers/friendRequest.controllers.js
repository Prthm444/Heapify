import FriendRequest from "../models/friendRequest.model.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { asyncHandler } from "../utils/async.utils.js";
import { ApiError } from "../utils/Error.utils.js";
import mongoose from "mongoose";

export const sendFriendRequest = asyncHandler(async (req, res) => {
	const friendUsername = req.params.username?.toLowerCase();
	if (!friendUsername) {
		throw new ApiError(500, "Cannot proceed request");
	}
	const friend = await User.findOne({ username: friendUsername });
	if (!friend) {
		throw new ApiError(500, "Couldn't find user to send friend request");
	}

	if (friend.username === req.user.username) {
		throw new ApiError(401, "cannot send friendrequest to userself");
	}

	const existingFriend = await User.exists({
		_id: req.user._id,
		friends: friend._id,
	});
	if (existingFriend) throw new ApiError(401, "Already friends");

	const existingRequest = await FriendRequest.findOne({
		fromUserId: req.user?._id,
		toUserId: friend._id,
	});
	console.log(existingRequest);
	if (existingRequest && existingRequest.status === "Pending") {
		throw new ApiError(402, "Request already sent");
	}
	const friendRequest = await FriendRequest.create({
		fromUserId: req.user?._id,
		toUserId: friend._id,
	});
	const createdFriendRequest = await FriendRequest.findById(
		friendRequest._id
	);
	if (!createdFriendRequest) {
		throw new ApiError(
			500,
			"Something went wrong during sending the friend request"
		);
	}

	res.status(200).json(
		new ApiResponse(
			200,
			createdFriendRequest,
			"Successfully sent request!"
		)
	);
});

export const getPendingFriendRequests = asyncHandler(async (req, res) => {
	const myUserId = req.user._id; // assuming JWT middleware sets req.user

	const requests = await FriendRequest.find({
		toUserId: myUserId,
		status: "Pending",
	})
		.populate("fromUserId", "username") // only fetch 'username' from User model
		.exec();

	const usernames = requests.map((req) => {
		return { username: req.fromUserId.username, requestId: req._id };
	});

	res.status(200).json(
		new ApiResponse(
			200,
			usernames,
			"Pending friend requests retrieved successfully"
		)
	);
});

export const acceptFriendRequest = asyncHandler(async (req, res) => {
	const requestId = req.params.requestId;
	if (!requestId) throw new ApiError(401, "cannot approve request");

	const request = await FriendRequest.findById(requestId);
	if (!request || request.status === "Rejected")
		throw new ApiError(401, "cannot find request");
	if (request.fromUserId !== req.user._id)
		throw new ApiError(401, "Request not authorized");
	if (request.status === "Accepted")
		throw new ApiError(401, "request already accepted");

	const existingFriend = await User.exists({
		_id: request.fromUserId,
		friends: request.toUserId,
	});
	request.status = "Accepted";
	if (existingFriend) {
		request.save({ validateBeforeSave: false });
		res.status(201).json(new ApiResponse(201, "Already friends"));
	}

	const session = await mongoose.startSession();

	try {
		session.startTransaction();

		await User.findByIdAndUpdate(
			request.fromUserId,
			{ $addToSet: { friends: request.toUserId } },
			{ session }
		);

		await User.findByIdAndUpdate(
			request.toUserId,
			{ $addToSet: { friends: request.fromUserId } },
			{ session }
		);

		await session.commitTransaction();
		session.endSession();
	} catch (error) {
		await session.abortTransaction();
		session.endSession();
		throw new ApiError(403, "couldn't add friends");
	}

	request.save({
		validateBeforeSave: false,
	});

	res.status(200).json(
		new ApiResponse(200, "Added friends , request accepted")
	);
});

export const rejectFriendRequest = asyncHandler(async (req, res) => {
	const requestId = req.params.requestId;

	const request = await FriendRequest.findById(requestId);

	if (!request || request.status === "Rejected")
		throw new ApiError(404, " cannot approve request");

	if (request.fromUserId !== req.user._id)
		throw new ApiError(401, "Request not authorized");

	await request.deleteOne();

	res.status(200).json(new ApiResponse(200, "Friend Request rejected"));
});
