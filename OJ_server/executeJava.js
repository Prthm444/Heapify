const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
	fs.mkdirSync(outputPath, { recursive: true });
}

const runJavaAgainstTestCases = async (filepath, testcases) => {
	const results = [];
	let verdict = {
		passed: 0,
		failed: 0,
		result: "RJ",
		currentTestcase: 0,
		executionTime: "",
	};

	try {
		const testCases = testcases;

		if (!Array.isArray(testCases) || testCases.length === 0) {
			return Promise.reject(new Error("No test cases found for this problem."));
		}

		return new Promise((resolve, reject) => {
			const runTest = (index) => {
				if (index >= testCases.length) {
					fs.unlink(filepath, () => {});

					const totalExecutionTime = results.reduce((sum, test) => sum + test.executionTime, 0).toFixed(3);
					verdict.executionTime = totalExecutionTime.toString() + " ms";

					if (verdict.passed === testCases.length) {
						verdict.result = "AC";
					} else if (verdict.result === "RJ") {
						verdict.result = "RJ";
					}

					return resolve({ results, verdict });
				}

				const { input, output: expectedOutput, isPublic } = testCases[index];

				const startTime = process.hrtime();
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
					console.log("heuyyy");
					verdict.currentTestcase = index + 1;
					verdict.result = "TLE";
					return resolve({ results, verdict });
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
					if (code !== 0 || stderr) {
						fs.unlink(filepath, () => {});
						verdict.currentTestcase = index + 1;
						verdict.result = "RE";
						return resolve({ results, verdict });
					} else if (executionTime > 3000) {
						fs.unlink(filepath, () => {});
						verdict.currentTestcase = index + 1;
						verdict.result = "TLE";
						return resolve({ results, verdict });
					} else {
						const actual = stdout.trim() || " ";
						const passed = actual === expectedOutput.trim();
						if (passed) {
							verdict.passed += 1;
						} else if (verdict.result === "RJ") {
							verdict.failed += 1;

							verdict.currentTestcase = index + 1;
						}

						results.push({
							input: isPublic ? input : "Hidden",
							expectedOutput: isPublic ? expectedOutput : "Hidden",
							actualOutput: isPublic ? actual : "Hidden",
							status: passed ? "Passed" : "Failed",
							executionTime,
						});
					}

					runTest(index + 1);
				});

				runProcess.on("error", (err) => {
					fs.unlink(filepath, () => {});
					verdict.result = "RE";
					reject({ results, verdict });
				});
			};

			runTest(0);
		});
	} catch (err) {
		throw err;
	}
};

module.exports = {
	runJavaAgainstTestCases,
};
