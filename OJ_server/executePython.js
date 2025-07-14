const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
	fs.mkdirSync(outputPath, { recursive: true });
}

const runPythonAgainstTestCases = async (filepath, testcases) => {
	const jobId = path.basename(filepath).split(".")[0];
	const results = [];
	let verdict = {
		passed: 0,
		failed: 0,
		result: "RJ",
		currentTestcase: 0,
		executionTime: "",
	};

	try {
		if (!Array.isArray(testcases) || testcases.length === 0) {
			throw new Error("No test cases provided.");
		}

		return new Promise((resolve) => {
			const runTest = (index) => {
				if (index >= testcases.length) {
					fs.unlink(filepath, () => {});
					const totalExecutionTime = results.reduce((sum, test) => sum + test.executionTime, 0).toFixed(3);
					verdict.executionTime = totalExecutionTime + " ms";
					if (verdict.passed === testcases.length) verdict.result = "AC";
					return resolve({ results, verdict });
				}

				const { input, output: expectedOutput, isPublic } = testcases[index];
				const startTime = process.hrtime();

				const runProcess = spawn("python", [filepath]);

				let stdout = "";
				let stderr = "";
				let timedOut = false;
				let timeout = 5000;

				// Kill the process if it runs too long
				const timer = setTimeout(() => {
					timedOut = true;
					runProcess.kill("SIGKILL");
				}, timeout);

				runProcess.stdin.write(input);
				runProcess.stdin.end();

				runProcess.stdout.on("data", (data) => {
					stdout += data.toString();
				});

				runProcess.stderr.on("data", (data) => {
					stderr += data.toString();
				});

				runProcess.on("close", (code) => {
					const [seconds, nanoseconds] = process.hrtime(startTime);
					const executionTime = seconds * 1000 + nanoseconds / 1e6;
					clearTimeout(timer);
					if (timedOut) {
						fs.unlink(filepath, () => {});
						verdict.currentTestcase = index + 1;
						verdict.result = "TLE";

						//console.log(`[ERROR] Time limit exceeded`);
						return resolve({ results, verdict });
					}

					if (code !== 0 || stderr) {
						fs.unlink(filepath, () => {});
						verdict.currentTestcase = index + 1;
						verdict.result = "RE";
						//console.log(`[ERROR] Runtime error: ${stderr}`);
						return resolve({ results, verdict });
					}

					if (executionTime > 3000) {
						fs.unlink(filepath, () => {});
						verdict.currentTestcase = index + 1;
						verdict.result = "TLE";
						//console.log(`[ERROR] Time limit exceeded`);
						return resolve({ results, verdict });
					}

					const actual = stdout.trim() || " ";
					const passed = actual === expectedOutput.trim();
					if (passed) {
						verdict.passed += 1;
					} else {
						verdict.failed += 1;
					}

					results.push({
						input: isPublic ? input : "Hidden",
						expectedOutput: isPublic ? expectedOutput : "Hidden",
						actualOutput: isPublic ? actual : "Hidden",
						status: passed ? "Passed" : "Failed",
						executionTime,
					});

					runTest(index + 1);
				});
			};

			runTest(0);
		});
	} catch (err) {
		//console.error("[FATAL ERROR]:", err);
		throw err;
	}
};

module.exports = {
	runPythonAgainstTestCases,
};
