const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

// Ensure outputs directory exists
if (!fs.existsSync(outputPath)) {
	fs.mkdirSync(outputPath, { recursive: true });
}

const runCppWithUserInput = (filepath, userInput) => {
	return new Promise((resolve, reject) => {
		const jobId = path.basename(filepath).split(".")[0];
		const outPath = path.join(outputPath, `${jobId}.exe`);

		// Compile C++ code
		exec(`g++ ${filepath} -o ${outPath}`, (compileErr, _, compileStderr) => {
			if (compileErr) {
				fs.unlink(filepath, () => {});
				return resolve({
					type: "Compilation Error",
					error: compileStderr,
				});
			}

			const runProcess = spawn(outPath, [], { cwd: outputPath });

			let stdout = "";
			let stderr = "";
			let timedOut = false;
			let timeout = 5000;

			// Kill the process if it runs too long
			const timer = setTimeout(() => {
				timedOut = true;
				runProcess.kill("SIGKILL");
			}, timeout);

			// Write user input string to stdin
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
				// Cleanup files
				fs.unlink(filepath, () => {});
				fs.unlink(outPath, () => {});

                if (timedOut) {
					return resolve({
						type: "Time Limit Exceeded",
						error: `Time limit exit - Process killed after ${timeout}ms`,
					});
				}

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
	});
};

module.exports = {
	runCppWithUserInput,
};
