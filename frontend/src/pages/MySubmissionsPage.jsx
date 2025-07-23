import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, NavLink } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism"; // ✅ Light theme
import { Loader } from "../components/Loader.jsx";
import SubmissionsLoader from "../components/SubmissionsLoader.jsx";

const MySubmissionsPage = () => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [showCode, setShowCode] = useState("");
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	if (!isLoggedIn) return <Navigate to="/login" replace />;

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				const res = await axios.get(`${SERVER_URL}/submissions/all`, {
					withCredentials: true,
				});
				setSubmissions(res.data.data || []);
			} catch (err) {
				console.error("Error fetching submissions:", err);
				setError("Failed to load submissions.");
			} finally {
				setLoading(false);
			}
		};
		fetchSubmissions();
	}, []);

	const formatDate = (date) =>
		new Date(date).toLocaleString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

	const getStatusStyle = (status) => {
		switch (status) {
			case "AC":
				return "bg-green-50 text-green-700 border-green-200";
			case "TLE":
			case "RE":
			case "CLE":
				return "bg-yellow-50 text-yellow-700 border-yellow-200";
			case "RJ":
			case "WA":
			default:
				return "bg-red-50 text-red-700 border-red-200";
		}
	};

	return (
		<div className="p-6 max-w-6xl mx-auto">
			{!loading && submissions.length !== 0 && <h1 className="text-3xl font-bold text-blue-700 mb-6">My Submissions</h1>}

			{loading && <Loader />}
			{error && <p className="text-red-600">{error}</p>}
			{submissions.length === 0 && !loading && !error && <SubmissionsLoader text="No Submissions yet" />}

			{submissions.length > 0 && (
				<div className="space-y-6">
					{submissions.map((submission) => (
						<div key={submission._id} className="border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition bg-blue-100">
							<div className="flex justify-between items-start">
								<div>
									<h2 className="text-lg font-semibold text-gray-800">
										{submission.problemId ? (
											<NavLink to={`/problems/${submission.problemId._id}`} className="text-blue-600 hover:underline">
												{submission.problemId.title}
											</NavLink>
										) : (
											<span className="text-gray-400 italic">[Deleted Problem]</span>
										)}
									</h2>
									<p className="text-sm text-gray-500 mt-1">Submitted on: {formatDate(submission.createdAt)}</p>
								</div>
								<div className={`text-sm font-semibold px-3 py-1 rounded-full border ${getStatusStyle(submission.status)}`}>
									{submission.status}
								</div>
							</div>

							<div className="mt-4 text-sm text-gray-700 space-y-1">
								<p>
									<strong>Language:</strong> {submission.language.toUpperCase()}
								</p>
								<p>
									<strong>Execution Time:</strong> {submission.executionTime || "N/A"}
								</p>
								<p>
									<strong>Submission ID:</strong> {submission._id}
								</p>
							</div>
							<button
								className=" my-4 px-4 py-2 rounded-md font-medium transition bg-blue-600 text-white "
								onClick={() => setShowCode(showCode === "" ? submission._id : showCode === submission._id ? "" : submission._id)}
							>
								{showCode === submission._id ? "Hide Code" : "Show Code"}
							</button>

							{showCode === submission._id && submission.code && (
								<div className="mt-5">
									<p className="text-sm font-medium text-gray-800 mb-2">Submitted Code:</p>
									<SyntaxHighlighter
										language={submission.language.toLowerCase()}
										style={prism}
										customStyle={{
											borderRadius: "0.75rem",
											fontSize: "0.85rem",
											padding: "1rem",
											background: "#f9fafb",
											border: "1px solid #e5e7eb",
										}}
										showLineNumbers
										wrapLongLines
									>
										{submission.code}
									</SyntaxHighlighter>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MySubmissionsPage;
