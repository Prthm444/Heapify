const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { generateFile } = require("./generateFile");
const { runCppAgainstTestCases } = require("./executeCpp");
const { runJavaAgainstTestCases } = require("./executeJava");
const { runPythonAgainstTestCases } = require("./executePython");
const { runCppWithUserInput } = require("./runCpp");
const { runJavaWithUserInput } = require("./runJava");
const { runPythonWithUserInput } = require("./runPython");

const axios = require("axios");
const app = express();

dotenv.config();
//connectDB();
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

app.post("/run", async (req, res) => {
	const { language = "cpp", code, testcases } = req.body;
	if (code === undefined) {
		return res.status(404).json({ success: false, error: "Empty code!" });
	}
	try {
		const filePath = generateFile(language, code);
		// Authenticate with the main server (replace with proper token-based auth in production)
		let results, verdict;
		//console.log("calling..................................................................................................");
		if (language === "java") {
			({ results, verdict } = await runJavaAgainstTestCases(filePath, testcases));
			//	console.log("output is : ", verdict);
		} else if (language === "cpp") {
			({ results, verdict } = await runCppAgainstTestCases(filePath, testcases));
		} else if (language === "py") {
			({ results, verdict } = await runPythonAgainstTestCases(filePath, testcases));
		}

		//console.log(output);

		res.status(200).json({ results, verdict });
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: error.message || error.stderr || error,
		});
	}
});

app.post("/customrun", async (req, res) => {
	const { code, language, customInput } = req.body;
	if (code === undefined) {
		return res.status(404).json({ success: false, error: "Empty code!" });
	}

	try {
		const filePath = generateFile(language, code);
		let result = {};
		if (language === "cpp") {
			result = await runCppWithUserInput(filePath, customInput);
		} else if (language === "java") {
			result = await runJavaWithUserInput(filePath, customInput);
		} else if (language === "py") {
			//console.log("runnig py");
			result = await runPythonWithUserInput(filePath, customInput);
			//console.log(result);
		}

		//console.log("result : ", result);

		res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: error.message || error.stderr || error,
		});
	}
});

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}!`);
});
