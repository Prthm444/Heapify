import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProblemDetailPage = () => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

	if (!isLoggedIn) return <Navigate to="/login" replace />;
	const { id } = useParams();
	const [problem, setProblem] = useState(null);
	const [code, setCode] = useState("");
	const [language, setLanguage] = useState("cpp");
	const [verdict, setVerdict] = useState(null);

	useEffect(() => {
		const fetchProblem = async () => {
			const res = await axios.get(`http://127.0.0.1:8001/problems/${id}`, { withCredentials: true });
			setProblem(res.data.data);

			// const reslogin = await axios.post(
			// 	"http://localhost:8001/user/login",
			// 	{
			// 		username: "pratham2",
			// 		email: "adi@gmail.com",
			// 		password: "heheh",
			// 	},
			// 	{ withCredentials: true }
			// );
			// console.log(reslogin);
		};

		fetchProblem();
	}, [id]);

	const handleSubmit = async () => {
		try {
			const res = await axios.post(
				"http://127.0.0.1:8001/submissions/new",
				{
					language,
					code,
					problemId: id,
				},
				{ withCredentials: true }
			);

			setVerdict(res.data.data.verdict);
			alert("Submission successful ✅");
		} catch (err) {
			alert("Submission failed ❌");
			console.error(err);
		}
	};

	if (!problem) return <div className="p-6">Loading...</div>;

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

	return (
		<div className="flex h-screen">
			{/* Left Section */}
			<div className="w-1/2 p-6 flex flex-col justify-between border-r border-gray-300 overflow-y-auto">
				<div>
					<h1 className="text-2xl font-bold text-blue-700">{problem.title}</h1>

					{/* Difficulty Badge */}
					<span className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
						{problem.difficulty}
					</span>

					{/* Tags */}
					<div className="mt-2 flex flex-wrap gap-2 text-sm">
						{problem.tags.map((tag, i) => (
							<span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
								{tag}
							</span>
						))}
					</div>

					{/* Description */}
					<h2 className="text-lg font-semibold mt-6 mb-2 text-gray-700">Description</h2>
					<p className="text-gray-800 whitespace-pre-line">{problem.description}</p>

					{/* Input Format */}
					<h3 className="mt-6 font-semibold">Input Format</h3>
					<p className="text-gray-700 whitespace-pre-line">{problem.inputFormat}</p>

					{/* Output Format */}
					<h3 className="mt-4 font-semibold">Output Format</h3>
					<p className="text-gray-700 whitespace-pre-line">{problem.outputFormat}</p>

					{/* Constraints */}
					<h3 className="mt-4 font-semibold">Constraints</h3>
					<p className="text-gray-700 whitespace-pre-line">{problem.constraints}</p>

					{/* Examples */}
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
				</div>

				{/* Submit Button */}
				<div>
					<button onClick={handleSubmit} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition w-full">
						Submit
					</button>

					{/* Verdict Box */}
					{verdict && (
						<div
							className={`mt-4 px-4 py-3 rounded border font-semibold text-sm ${
								verdict.result === "AC" ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"
							}`}
						>
							{verdict.result === "AC" ? (
								<>
									✅ <strong>Accepted</strong> – All testcases passed
									<br />⏱ Time: <strong>{verdict.executionTime}</strong>
								</>
							) : (
								<>
									❌ <strong>{verdict.result}</strong> – Some testcases failed
									<br />
									🚫 Failed: <strong>{verdict.failed}</strong>
								</>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Right Section: Code Editor */}
			<div className="w-1/2 p-6">
				<h2 className="text-lg font-semibold mb-2">Your Solution</h2>
				<textarea
					placeholder="// Write your code here"
					value={code}
					onChange={(e) => setCode(e.target.value)}
					className="w-full h-full font-mono p-4 border rounded resize-none text-sm outline-none"
				/>
			</div>
		</div>
	);
};

export default ProblemDetailPage;
