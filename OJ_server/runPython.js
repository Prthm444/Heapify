const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

// Ensure outputs directory exists
if (!fs.existsSync(outputPath)) {
	fs.mkdirSync(outputPath, { recursive: true });
}

const runPythonWithUserInput = (filepath, userInput) => {
	return new Promise((resolve, reject) => {
		const pythonProcess = spawn("python", [filepath]);
		//userInput += "\n";
        //console.log(userInput)
		let stdout = "";
		let stderr = "";

		// Write user input string to stdin
		pythonProcess.stdin.write(userInput);
		pythonProcess.stdin.end();

		pythonProcess.stdout.on("data", (data) => {
			stdout += data.toString();
		});
        //console.log(stdout);
		pythonProcess.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		pythonProcess.on("close", (code) => {
			// Cleanup file
			fs.unlink(filepath, () => {});

			if (code !== 0 || stderr) {
				return resolve({
					type: "Runtime Error",
					error: stderr || `Exited with code ${code}`,
				});
			} else {
				return resolve({
					type: "Success",
					output: stdout.trim(),
				});
			}
		});

		pythonProcess.on("error", (error) => {
			fs.unlink(filepath, () => {});
			return resolve({
				type: "Execution Error",
				error: error.message,
			});
		});
	});
};


module.exports = {
	runPythonWithUserInput,
};
