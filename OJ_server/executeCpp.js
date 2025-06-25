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

const runCppAgainstTestCases = async (filepath, problemId) => {
	const jobId = path.basename(filepath).split(".")[0];
	const outPath = path.join(outputPath, `${jobId}.exe`);

	

	// Fetch test cases for the given problem
	return axios
		.get("http://127.0.0.1:8001/problems/testcases/" + problemId)
		.then((testCasesObj) => {
			const testCases = testCasesObj.data.ioPairs || testCasesObj.data;

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
							return reject({
								error: "Compilation failed",
								stderr: compileStderr,
							});
						}

						const results = [];

						// Function to recursively run each test case
						const runTest = (index) => {
							if (index >= testCases.length) {
								// Delete code and executable files after all test cases
								fs.unlink(filepath, () => {});
								fs.unlink(outPath, () => {});
								return resolve(results);
							}

							const { input, output: expectedOutput } =
								testCases[index];

							// Spawn process to run compiled executable
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
								if (code !== 0 || stderr) {
									results.push({
										status: "Error",
										input,
										expectedOutput,
										actualOutput: stderr.trim(),
									});
								} else {
									const actual = stdout.trim();
									const passed =
										actual ===
										expectedOutput.trim();

									results.push({
										input,
										expectedOutput,
										actualOutput: actual,
										status: passed
											? "Passed"
											: "Failed",
									});
								}

								runTest(index + 1); // Run next test
							});
						};

						runTest(0); // Start testing
					}
				);
			});
		})
		.catch((err) => {
			throw err;
		});
};

module.exports = {
	runCppAgainstTestCases,
};
