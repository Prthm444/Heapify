const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { generateFile } = require("./generateFile");
const { runCppAgainstTestCases } = require("./executeCpp");
const { connectDB } = require("./DB/connectDB");
const axios = require("axios");
const app = express();

dotenv.config();
connectDB();
/**
 * Entry point for the Express server.
 *
 * 1. Receives code + language choice from the client (`/run` endpoint).
 * 2. Persists the source code to a temporary file (`generateFile`).
 * 3. Compiles & executes the code (`executeCpp`).
 * 4. Returns the program output back to the caller as JSON.
 *
 * NOTE: Only the C++ workflow is fully wired-up right now, but because the
 *       architecture is modular you can plug in extra languages by adding
 *       another `execute<LANG>.js` implementation and a simple switch-case.
 */

//middlewares
app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.json({ online: "compiler" });
});

app.post("/run/:id", async (req, res) => {
	// const language = req.body.language;
	// const code = req.body.code;

	const problemId = req.params.id;
	const { language = "cpp", code } = req.body;
	if (code === undefined) {
		return res.status(404).json({ success: false, error: "Empty code!" });
	}
	try {
		const filePath = generateFile(language, code);
		// Authenticate with the main server (replace with proper token-based auth in production)
		await axios.post(
			"http://127.0.0.1:8001/user/login",
			{
				username: process.env.MAIN_SERVER_USERNAME,
				password: process.env.MAIN_SERVER_PASSWORD,
			},
			{
				withCredentials: true,
			}
		);

		const output = await runCppAgainstTestCases(filePath, problemId);
		//console.log(output);
		const submissionResponse = await axios.post(
			"http://127.0.0.1:8001/submissions/new",
			{ output:output }
		);
		console.log(submissionResponse.data);
		//console.log("output is : ", output);
		res.json({ output });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}!`);
});
