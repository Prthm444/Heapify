import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const exampleJSON = {
	title: "Find the Maximum Element in an Array",
	description: "Given an array of integers, your task is to find and return the maximum element in the array.",
	difficulty: "Easy",
	tags: ["Array", "Math", "Beginner"],
	inputFormat:
		"The first line contains an integer N (1 ≤ N ≤ 1000) — the number of elements in the array. The second line contains N space-separated integers a1, a2, ..., aN (−10^6 ≤ ai ≤ 10^6).",
	outputFormat: "Print a single integer — the maximum element in the array.",
	constraints: "1 ≤ N ≤ 1000; −10^6 ≤ ai ≤ 10^6",
	examples: [
		{
			input: "5 1 3 2 9 5",
			output: "9",
			explanation: "The maximum value among the elements is 9.",
		},
		{
			input: "4 -3 -1 -7 -2",
			output: "-1",
			explanation: "All numbers are negative, and -1 is the maximum.",
		},
	],
	testCases: [
		{ input: "6 10 20 30 40 50 60", output: "60", isPublic: false },
		{ input: "3 0 -1 -2", output: "0", isPublic: false },
		{ input: "1 42", output: "42", isPublic: false },
		{ input: "7 -5 -10 -3 -1 -7 -20 -100", output: "-1", isPublic: false },
		{ input: "5 1000000 999999 500000 -1000000 -500000", output: "1000000", isPublic: false },
		{ input: "4 8 8 8 8", output: "8", isPublic: false },
		{ input: "10 1 3 5 7 9 11 13 15 17 19", output: "19", isPublic: false },
	],
};

const AddProblemPage = () => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	if (!isLoggedIn) return <Navigate to="/login" replace />;

	const [jsonInput, setJsonInput] = useState(JSON.stringify(exampleJSON, null, 2));
	const [message, setMessage] = useState("");

	const handleSubmit = async () => {
		try {
			const parsed = JSON.parse(jsonInput);

			// Validation
			const requiredFields = ["title", "description", "difficulty", "tags", "inputFormat", "outputFormat", "constraints", "examples", "testCases"];
			for (const field of requiredFields) {
				if (!parsed[field]) {
					setMessage(`❌ Missing required field: ${field}`);
					return;
				}
			}
			//console.log("Parsed JSON:", parsed);
			const res = await axios.post("http://localhost:8001/problems/new", parsed, {
				withCredentials: true,
			});

			setMessage("✅ Problem added successfully!");
			console.log("Server response:", res.data);
		} catch (err) {
			console.error(err);
			setMessage("❌ Invalid JSON or submission failed.");
		}
	};

	return (
		<div className="p-8 max-w-5xl mx-auto">
			<h1 className="text-3xl font-bold text-blue-700 mb-6">Add New Problem</h1>

			<p className="mb-2 text-gray-600">Paste or edit a JSON object similar to the problem given below - just for reference :</p>

			{/* Example Format */}
			<div className="bg-gray-100 border border-gray-300 p-4 mb-4 rounded text-sm overflow-auto max-h-64">
				<pre>{JSON.stringify(exampleJSON, null, 2)}</pre>
			</div>

			<div className="mb-4 mt-4">
				<h1 className="text-lg font-semibold text-gray-800 mb-2">Your problem : </h1>
			</div>
			{/* JSON Input */}
			<textarea
				className="w-full h-[400px] p-4 font-mono border border-gray-300 rounded focus:ring focus:ring-blue-300 mb-4 resize-none"
				value={jsonInput}
				onChange={(e) => setJsonInput(e.target.value)}
				placeholder="// Paste your JSON here"
			/>

			{/* Submit Button */}
			<button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-semibold">
				Submit Problem
			</button>

			{/* Message */}
			{message && <div className="mt-4 text-sm font-medium">{message}</div>}
		</div>
	);
};

export default AddProblemPage;
