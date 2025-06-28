const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// Path where compiled .exe and output files will be stored
const outputPath = path.join(__dirname, "outputs");

// Create the outputs directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
	fs.mkdirSync(outputPath, { recursive: true });
}

const runCppAgainstTestCases = async (filepath, testcases) => {
	const jobId = path.basename(filepath).split(".")[0];
	const outPath = path.join(outputPath, `${jobId}.exe`);
	console.log(testcases);
	// Fetch test cases for the given problem
    const results = [];
					let verdict = {
						passed: 0,
						failed: 0,
						result: "RJ",
						currentTestcase: 0,
						executionTime:""
					};
	try {
		const testCases = testcases;
		console.log("found testcases : ", testCases);

		if (!Array.isArray(testCases) || testCases.length === 0) {
			return Promise.reject(
				new Error("No test cases found for this problem.")
			);
		}
		return new Promise((resolve, reject) => {
			// Compile the submitted C++ code
			exec(
				`g++ ${filepath} -o ${outPath}`,
				(compileErr, _, compileStderr) => {
					if (compileErr) {
						console.log("compilation error");
						fs.unlink(filepath, () => {});
						verdict.result = "CLE";
						return resolve({results, verdict});
					}

					

					// Function to recursively run each test case
					const runTest = (index) => {
						if (index >= testCases.length) {
							// Delete code and executable files after all test cases
							fs.unlink(filepath, () => {});
							fs.unlink(outPath, () => {});
							const totalExecutionTime = results.reduce((sum, test) => sum + test.executionTime, 0).toFixed(3);

                            verdict.executionTime=totalExecutionTime.toString()+" ms";
							if (verdict.passed == testCases.length)
								verdict.result = "AC";

							return resolve({ results, verdict });
						}

						const { input, output: expectedOutput } =
							testCases[index];

						// Spawn process to run compiled executable
						const startTime = process.hrtime();
						const runProcess = spawn(outPath, [], {
							cwd: outputPath,
						});

						let stdout = "";
						let stderr = "";

						// Feed input to the program
						runProcess.stdin.write(input);
						runProcess.stdin.end();

						runProcess.stdout.on("data", (data) => {
							stdout += data.toString();
						});

						runProcess.stderr.on("data", (data) => {
							stderr += data.toString();
						});

						// Handle process completion
						runProcess.on("close", (code) => {
							const [seconds, nanoseconds] =
								process.hrtime(startTime);
							const executionTime = (
								seconds * 1000 +
								nanoseconds / 1e6
							) // in ms
							if (code !== 0 || stderr) {
								fs.unlink(filepath, () => {});
								fs.unlink(outPath, () => {});

								verdict.currentTestcase = index + 1;
								verdict.result = "RE";

								return resolve({ results, verdict });
								
							} else if (executionTime > 2000) {
								fs.unlink(filepath, () => {});
								fs.unlink(outPath, () => {});

								verdict.currentTestcase = index + 1;
								verdict.result = "TLE";

								return resolve({ results, verdict });
							} else {
								const actual = stdout.trim();
								const passed =
									actual === expectedOutput.trim();
								if (passed) {
									verdict.passed += 1;
								} else {
									verdict.failed += 1;
								}
								results.push({
									input,
									expectedOutput,
									actualOutput: actual,
									status: passed
										? "Passed"
										: "Failed",
									executionTime
								});
							}

							runTest(index + 1); // Run next test
						});
					};

					runTest(0); // Start testing
				}
			);
		});
	} catch (err) {
		throw err;
	}
};

module.exports = {
	runCppAgainstTestCases,
};
