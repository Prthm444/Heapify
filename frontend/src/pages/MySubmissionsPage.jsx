import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate, NavLink } from "react-router-dom";

const MySubmissionsPage = () => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const [submissions, setSubmissions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	if (!isLoggedIn) return <Navigate to="/login" replace />;

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				const res = await axios.get("http://localhost:8001/submissions/all", {
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
				return "bg-green-100 text-green-800 border-green-300";
			case "TLE":
			case "RE":
			case "CLE":
				return "bg-orange-100 text-orange-800 border-orange-300";
			case "RJ":
			case "WA":
			default:
				return "bg-red-100 text-red-800 border-red-300";
		}
	};

	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h1 className="text-3xl font-bold text-blue-700 mb-6">My Submissions</h1>

			{loading && <p className="text-gray-500">Loading submissions...</p>}
			{error && <p className="text-red-600">{error}</p>}

			{submissions.length === 0 && !loading && !error && <p className="text-gray-600">No submissions yet.</p>}

			{submissions.length > 0 && (
				<div className="space-y-4">
					{submissions.map((submission) => (
						<div key={submission._id} className="border border-gray-200 rounded-md shadow-sm p-4 hover:shadow transition">
							<div className="flex justify-between items-start">
								<div>
									<h2 className="text-lg font-semibold text-gray-800">
										{submission.problemId ? (
											<NavLink to={`/problems/${submission.problemId._id}`} className="text-blue-700 hover:underline">
												{submission.problemId.title}
											</NavLink>
										) : (
											<span className="text-gray-400 italic">[Deleted Problem]</span>
										)}
									</h2>
									<p className="text-sm text-gray-600 mt-1">Submitted on: {formatDate(submission.createdAt)}</p>
								</div>

								{/* Status Badge */}
								<div className={`text-sm font-medium px-3 py-1 rounded border ${getStatusStyle(submission.status)}`}>
									{submission.status}
								</div>
							</div>

							{/* Details */}
							<div className="mt-3 text-sm text-gray-700 space-y-1">
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
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default MySubmissionsPage;
