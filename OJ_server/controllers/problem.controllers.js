const { Problem } = require("../models/problem.models");

const getAllInputsAndOutputs = async (problemId) => {
	const problem = await Problem.findById(problemId);

	if (!problem) {
		throw new Error("Problem not found");
	}

	//console.log("problem found ", problem);

	// Extract only input-output pairs
	const ioPairs = problem.testCases.map((tc) => ({
		input: tc.input,
		output: tc.output,
	}));

	//console.log("returing ", ioPairs);

	return { ioPairs };
};

module.exports = { getAllInputsAndOutputs };
