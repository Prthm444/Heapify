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
		let timedOut = false;
		let timeout = 5000;

		// Kill the process if it runs too long
		const timer = setTimeout(() => {
			timedOut = true;
			runProcess.kill("SIGKILL");
			fs.unlink(filepath, () => {});

			return resolve({
				type: "Time Limit Exceeded",
				error: `Time limit exit java - Process killed after ${timeout}ms`,
			});
		}, timeout);

		runProcess.stdin.write(userInput);
		runProcess.stdin.end();

		runProcess.stdout.on("data", (data) => {
			stdout += data.toString();
		});

		runProcess.stderr.on("data", (data) => {
			stderr += data.toString();
		});

		runProcess.on("close", (code) => {
			clearTimeout(timer);

			if (timedOut) {
				return;
			}
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
