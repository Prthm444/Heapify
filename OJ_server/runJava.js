const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

// Ensure outputs directory exists
if (!fs.existsSync(outputPath)) {
	fs.mkdirSync(outputPath, { recursive: true });
}

const runJavaWithUserInput = (filepath, userInput) => {
	return new Promise((resolve, reject) => {
		const runProcess = spawn("java", [filepath], {
			cwd: outputPath,
		});

		let stdout = "";
		let stderr = "";

		runProcess.stdin.write(userInput);
		runProcess.stdin.end();

		runProcess.stdout.on("data", (data) => {
			stdout += data.toString();
		});

		runProcess.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		runProcess.on("close", (code) => {
			fs.unlink(filepath, () => {}); // cleanup .java file

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
	});
};

module.exports = {
	runJavaWithUserInput,
};
