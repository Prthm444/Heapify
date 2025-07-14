import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";

const ProblemDetailPage = () => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	if (!isLoggedIn) return <Navigate to="/login" replace />;

	const { id } = useParams();
	const [problem, setProblem] = useState(null);
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("cpp");
	const [verdict, setVerdict] = useState(null);
	const [firstFailedCase, setFirstFailedCase] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmittingAI, setIsSubmittingAI] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [customInput, setCustomInput] = useState("");
	const [runOutput, setRunOutput] = useState(null);
	const [isRunning, setIsRunning] = useState(false);
	const [showOutput, setShowOutput] = useState(true);
	const [showAIModal, setShowAIModal] = useState(false);
	const [AiReview, setAiReview] = useState("");

	// Boilerplate codes
	const cppBoilerplate = `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    
    // Your code here
    
    
    return 0;
}`;

	const javaBoilerplate = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        // Fast I/O
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        PrintWriter pw = new PrintWriter(System.out);
        
        // Your code here
        
        
        pw.flush();
        pw.close();
    }
}`;

	const pythonBoilerplate = `import sys
input = sys.stdin.read
data = input().split()

# Your code here
`;

	useEffect(() => {
		const fetchProblem = async () => {
			const res = await axios.get(`http://localhost:8001/problems/${id}`, {
				withCredentials: true,
			});
			setProblem(res.data.data);
		};

		fetchProblem();
	}, [id]);

	useEffect(() => {
		if (language === "cpp") {
			setCode(cppBoilerplate);
		} else if (code === "py") {
			setCode(pythonBoilerplate);
		} else if (language === "java") {
			setCode(javaBoilerplate);
		}
	}, [language]);

	const handleRunCode = async () => {
		setVerdict(null);
		setFirstFailedCase(null);
		if (!code.trim()) {
			toast.error("Code cannot be empty");
			return;
		}
		setIsRunning(true);
		setRunOutput(null);
		const loadingToast = toast.loading("Running your code...");

		try {
			const res = await axios.post(
				"http://localhost:8001/submissions/run",
				{
					language,
					code,
					customInput,
				},
				{ withCredentials: true }
			);

			setRunOutput(res.data.data.output || res.data.data.error || "No output returned");
			toast.update(loadingToast, {
				render: res.data.data.error ? "Some error during running code" : "Code ran successfully!",
				type: res.data.data.error ? "error" : "success",
				isLoading: false,
				autoClose: 3000,
			});
		} catch (err) {
			//console.error(err);
			toast.update(loadingToast, {
				render: " Server error",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
		} finally {
			setIsRunning(false);
		}
	};

	const handleAI = async () => {
		setIsSubmittingAI(true);
		const loadingToastAI = toast.loading("Getting Ai review...");
		try {
			const response = await axios.post(
				"http://localhost:8001/problems/ai",
				{
					code,
					problem,
				},
				{
					withCredentials: true,
				}
			);
			toast.update(loadingToastAI, {
				render: "Request successfull!",
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});
			setAiReview(response.data.data.review);
			//console.log("ai : -------- ", AiReview);
			setShowAIModal(true);
		} catch (err) {
			toast.error("Error while getting Ai review");
			toast.update(loadingToastAI, {
				render: " Some error has occured ",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
		}

		setIsSubmittingAI(false);
	};

	const handleSubmit = async () => {
		setVerdict(null);
		setFirstFailedCase(null);
		setIsSubmitting(true);
		setFirstFailedCase(null); // Clear previous failed case
		const loadingToast = toast.loading("Loading...");
		try {
			const res = await axios.post(
				"http://localhost:8001/submissions/new",
				{
					language,
					code,
					problemId: id,
				},
				{ withCredentials: true }
			);

			const { verdict, results } = res.data.data;
			setVerdict(verdict);

			const failed = results.find((r) => r.status !== "Passed") || "";
			if (failed) setFirstFailedCase(failed);

			setShowModal(true);
			toast.update(loadingToast, {
				render: "Submitted successfully!",
				type: "success",
				isLoading: false,
				autoClose: 3000,
			});
		} catch (err) {
			toast.update(loadingToast, {
				render: "Submission unsuccessful. Please try again.",
				type: "error",
				isLoading: false,
				autoClose: 3000,
			});
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "Easy":
				return "text-green-700 bg-green-100 border border-green-300";
			case "Medium":
				return "text-yellow-700 bg-yellow-100 border border-yellow-300";
			case "Hard":
				return "text-red-700 bg-red-100 border border-red-300";
			default:
				return "text-gray-700 bg-gray-100 border border-gray-300";
		}
	};

	const [SampleCode, setSampleCode] = useState(cppBoilerplate); // Initialize with C++ boilerplate

	if (!problem) return <div className="p-6">Loading...</div>;

	return (
		<>
			<div className=" flex h-screen">
				{/* Left Section */}
				<div className="w-1/2 p-6 flex flex-col border-r border-gray-300 overflow-y-auto">
					<div className="flex-1">
						<h1 className="text-2xl font-bold text-blue-700">{problem.title}</h1>
						<span className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
							{problem.difficulty}
						</span>
						<div className="mt-2 flex flex-wrap gap-2 text-sm">
							{problem.tags.map((tag, i) => (
								<span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
									{tag}
								</span>
							))}
						</div>

						{/* Problem Description */}
						<h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">Description</h2>
						<p className="text-gray-800 whitespace-pre-line">{problem.description}</p>

						<h3 className="mt-6 font-semibold">Input Format</h3>
						<p className="text-gray-700 whitespace-pre-line">{problem.inputFormat}</p>

						<h3 className="mt-4 font-semibold">Output Format</h3>
						<p className="text-gray-700 whitespace-pre-line">{problem.outputFormat}</p>

						<h3 className="mt-4 font-semibold">Constraints</h3>
						<p className="text-gray-700 whitespace-pre-line">{problem.constraints}</p>

						<h3 className="mt-6 font-semibold">Examples</h3>
						<div className="mt-2 text-sm space-y-2">
							{problem.examples?.map((ex, i) => (
								<div key={i} className="bg-gray-100 p-3 rounded">
									<p>
										<strong>Input:</strong> {ex.input}
									</p>
									<p>
										<strong>Output:</strong> {ex.output}
									</p>
									<p>
										<strong>Explanation:</strong> {ex.explanation}
									</p>
								</div>
							))}
						</div>

						{/* Verdict Box */}
						{verdict && (
							<div
								className={`mt-6 px-4 py-3 rounded border font-semibold text-sm ${
									verdict.result === "AC" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"
								}`}
							>
								{verdict.result === "AC" ? (
									<>
										<strong>Accepted</strong> – All testcases passed
										<br />⏱ Time: <strong>{verdict.executionTime}</strong>
									</>
								) : (
									<>
										<strong>
											{verdict.result === "TLE"
												? "Time Limit Exceeded"
												: verdict.result === "RE"
												? "Runtime Error"
												: verdict.result === "CLE"
												? "Compilation Error"
												: verdict.result}
										</strong>{" "}
										Some testcases failed
										<br />
										Failed: <strong>{verdict.failed}</strong>
									</>
								)}
							</div>
						)}

						{/* First Failed Case */}
						{firstFailedCase && (
							<div className="mt-4 text-sm bg-red-50 border border-red-300 text-red-800 p-4 rounded space-y-2 overflow-x-auto">
								<h4 className="font-semibold"> First Failed Test Case</h4>
								<p>
									<strong>Input:</strong> <code>{firstFailedCase.input}</code>
								</p>
								<p>
									<strong>Expected Output:</strong> <code>{firstFailedCase.expectedOutput}</code>
								</p>
								<p>
									<strong>Actual Output:</strong> <code>{firstFailedCase.actualOutput}</code>
								</p>
								<p>
									<strong>Execution Time:</strong> {firstFailedCase.executionTime.toFixed(2)} ms
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Right Section: Editor + Submit */}
				<div className="w-1/2 p-6 flex flex-col">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-lg font-semibold">Your Solution</h2>
						<div className="flex items-center space-x-2">
							<label htmlFor="language" className="text-sm font-medium text-gray-700">
								Language:
							</label>
							<select
								id="language"
								value={language}
								onChange={(e) => {
									setLanguage(e.target.value);
									// Set boilerplate code when language changes
									switch (e.target.value) {
										case "cpp":
											setSampleCode(cppBoilerplate);
											break;
										case "java":
											setSampleCode(javaBoilerplate);
											break;
										case "py":
											setSampleCode(pythonBoilerplate);
											break;
										default:
											setSampleCode("");
									}
								}}
								className="border rounded px-2 py-1 text-sm"
							>
								<option value="cpp">C++</option>
								<option value="java">Java</option>
								<option value="py">Python</option>
							</select>
						</div>
					</div>

					<div className="border rounded overflow-hidden flex-1 min-h-6">
						<Editor
							height="100%"
							language={language}
							theme="vs-dark"
							value={SampleCode}
							onChange={(value) => setCode(value || "")}
							options={{
								fontSize: 14,
								minimap: { enabled: false },
								wordWrap: "on",
								scrollBeyondLastLine: false,
								automaticLayout: true,
							}}
						/>
					</div>

					{/* Custom Input and Run Button */}
					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">Custom Input</label>
						<textarea
							rows={2}
							className="w-full p-2 border rounded text-sm"
							placeholder="Enter your custom input..."
							value={customInput}
							onChange={(e) => setCustomInput(e.target.value)}
						></textarea>
					</div>

					<div className="flex justify-between mt-4 space-x-4">
						<button
							onClick={handleRunCode}
							disabled={isRunning}
							className={`bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition w-1/2 ${
								isRunning ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							{isRunning ? "Running..." : "Run Code"}
						</button>

						<button
							onClick={handleSubmit}
							disabled={isSubmitting}
							className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-1/2 ${
								isSubmitting ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							{isSubmitting ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Submitting...</span>
								</div>
							) : (
								"Submit"
							)}
						</button>
						<button
							onClick={handleAI}
							disabled={isSubmittingAI}
							className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-1/2 ${
								isSubmittingAI ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							{isSubmittingAI ? (
								<div className="flex items-center space-x-2">
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									<span>Getting AI review...</span>
								</div>
							) : (
								"Get AI Review"
							)}
						</button>
					</div>

					{/* Output box */}
					{runOutput && (
						<div className="mt-4">
							<button className="text-blue-600 text-sm font-medium mb-2 hover:underline" onClick={() => setShowOutput(!showOutput)}>
								{showOutput ? "Hide Output" : "Show Output"}
							</button>

							{showOutput && (
								<div className="text-sm bg-gray-50 border border-gray-300 p-4 rounded overflow-x-auto whitespace-pre-wrap">
									<h4 className="font-semibold mb-2">💬 Output</h4>
									<pre>{runOutput}</pre>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
			{/* Submission Result Modal */}
			{showModal && (
				<div className="fixed inset-0  bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
					<div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-xl font-bold">Submission Result</h3>
							<button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
								✕
							</button>
						</div>

						<div
							className={`p-4 rounded-lg mb-4 ${
								verdict.result === "AC"
									? "bg-green-50 border border-green-200 text-green-800"
									: "bg-red-50 border border-red-200 text-red-800"
							}`}
						>
							<div className="flex items-center gap-2">
								{verdict.result === "AC" ? (
									<>
										<span className="text-2xl">✅</span>
										<div>
											<p className="font-bold">Accepted</p>
											<p className="text-sm">All test cases passed</p>
										</div>
									</>
								) : (
									<>
										<span className="text-2xl">❌</span>
										<div>
											<p className="font-bold">
												{verdict.result === "TLE"
													? "Time Limit Exceeded"
													: verdict.result === "RE"
													? "Runtime Error"
													: verdict.result === "CLE"
													? "Compilation Error"
													: verdict.result}
											</p>
											<p className="text-sm">{verdict.failed} test case(s) failed</p>
										</div>
									</>
								)}
							</div>
						</div>

						{firstFailedCase && (
							<div className="space-y-4">
								<h4 className="font-semibold">Failed Test Case Details</h4>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="bg-gray-50 p-3 rounded border">
										<h5 className="font-medium text-sm mb-1">Input</h5>
										<pre className="text-xs bg-white p-2 rounded overflow-x-auto">{firstFailedCase.input}</pre>
									</div>
									<div className="bg-gray-50 p-3 rounded border">
										<h5 className="font-medium text-sm mb-1">Expected Output</h5>
										<pre className="text-xs bg-white p-2 rounded overflow-x-auto">{firstFailedCase.expectedOutput}</pre>
									</div>
									<div className="bg-gray-50 p-3 rounded border">
										<h5 className="font-medium text-sm mb-1">Your Output</h5>
										<pre className="text-xs bg-white p-2 rounded overflow-x-auto">{firstFailedCase.actualOutput}</pre>
									</div>
									<div className="bg-gray-50 p-3 rounded border">
										<h5 className="font-medium text-sm mb-1">Execution Time</h5>
										<p className="text-xs bg-white p-2 rounded">{firstFailedCase.executionTime.toFixed(2)} ms</p>
									</div>
								</div>
							</div>
						)}

						<div className="mt-6 flex justify-end">
							<button
								onClick={() => setShowModal(false)}
								className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
			{showAIModal && (
				<div className="h-auto fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
					<div className="h-auto relative bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-5xl w-[90%] border border-white/10">
						{/* Close Button */}
						<button
							onClick={() => setShowAIModal(false)}
							className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
							aria-label="Close AI Review Modal"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>

						{/* Header */}
						<h2 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">AI Code Review</h2>

						{/* Markdown Content */}
						<div className="m-3 prose-h2 prose-lg dark:prose-invert max-h-[65vh] overflow-y-auto px-4 text-gray-700 dark:text-gray-200">
							<ReactMarkdown components={{ p: ({ children }) => <p className="mb-6">{children}</p> }}>{AiReview}</ReactMarkdown>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default ProblemDetailPage;
