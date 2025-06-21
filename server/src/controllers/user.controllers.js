import { asyncHandler } from "../utils/async.utils.js";
import { ApiError } from "../utils/Error.utils.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
	try {
		const user = await User.findById(userId);
		const AccessToken = user.generateAccessToken();
		const RefreshToken = user.generateRefreshToken();

		user.RefreshToken = RefreshToken;
		//console.log(user);
		await user.save({ validateBeforeSave: false });
		//console.log("ACC: ", AccessToken);
		return { AccessToken, RefreshToken };
	} catch (error) {
		throw new ApiError(
			500,
			"Something went wrong while generating refresh and access token"
		);
	}
};

const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password, bio } = req.body;

	if (
		[username, email, bio, password].some((field) => field?.trim() === "")
	) {
		throw new ApiError(400, "All fields are required");
	}

	const existedUser = await User.findOne({
		$or: [{ username }, { email }],
	});

	if (existedUser) {
		throw new ApiError(401, "Username or email already exists");
	}

	const user = await User.create({
		username: username.toLowerCase(),
		email,
		password,
		bio,
	});

	const createdUser = await User.findById(user._id).select(
		"-password -RefreshToken"
	);
	if (!createdUser) {
		throw new ApiError(
			500,
			"Something went wrong during registering user"
		);
	}
	return res
		.status(201)
		.json(
			new ApiResponse(
				200,
				createdUser,
				"User registered successfully!!"
			)
		);
});

const loginUser = asyncHandler(async (req, res) => {
	const { username, email, password, bio } = req.body;

	//console.log(username);

	if (!username && !email) {
		throw new ApiError(400, "username or email is required");
	}

	const user = await User.findOne({
		$or: [{ username: username.toLowerCase() }, { email }],
	});
	//console.log(user);
	if (!user) {
		throw new ApiError(404, "User not found");
	}

	const isPasswordValid = await user.isPasswordCorrect(password);

	if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

	const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
		user._id
	);

	const loggedInUser = await User.findById(user._id).select(
		"-password -Refreshtoken"
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	//console.log(AccessToken);

	return res
		.status(200)
		.cookie("accessToken", AccessToken, options)
		.cookie("refreshToken", RefreshToken, options)
		.json(
			new ApiResponse(
				200,
				{ user: loggedInUser, AccessToken, RefreshToken },
				"User LoggedIn Successfully"
			)
		);
});

const logoutUser = asyncHandler(async (req, res) => {
	await User.findByIdAndUpdate(
		req.user._id,
		{
			$unset: {
				refreshToken: 1, // this removes the field from document
			},
		},
		{
			new: true,
		}
	);

	const options = {
		httpOnly: true,
		secure: true,
	};

	return res
		.status(200)
		.clearCookie("accessToken", options)
		.clearCookie("refreshToken", options)
		.json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser };
