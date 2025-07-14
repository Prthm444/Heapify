import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProblemPage = () => {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const [problems, setProblems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProblems = async () => {
			try {
				const res = await axios.get("http://localhost:8001/problems/list", {
					withCredentials: true,
				});
				setProblems(res.data.data);
			} catch (err) {
				console.error(err);
				setError("Failed to fetch problems.");
			} finally {
				setLoading(false);
			}
		};

		fetchProblems();
	}, []);

	const formatDate = (isoDate) =>
		new Date(isoDate).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "Easy":
				return "text-green-600 bg-green-50 border-green-200";
			case "Medium":
				return "text-yellow-700 bg-yellow-50 border-yellow-200";
			case "Hard":
				return "text-red-600 bg-red-50 border-red-200";
			default:
				return "text-gray-600 bg-gray-50 border-gray-200";
		}
	};

	if (!isLoggedIn) return <Navigate to="/login" replace />;

	return (
		<div className="min-h-screen px-6 py-10 bg-white text-gray-800">
			<div className="max-w-6xl mx-auto">
				<h1 className="text-4xl font-bold text-blue-800 mb-10 text-center">All Problems</h1>

				<NavLink to="/add-problem">
					<button className="fixed bottom-8 right-8 px-6 py-3 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium transition duration-200">
						Add New Problem
					</button>
				</NavLink>

				{loading && <div className="text-center text-gray-500">Loading problems...</div>}
				{error && <p className="text-red-600 text-center">{error}</p>}

				{problems.length > 0 && (
					<div className="flex flex-col gap-6">
						{problems.map((problem) => (
							<NavLink key={problem._id} to={`/problems/${problem._id}`} className="block transition hover:scale-[1.01]">
								<div className="border border-gray-200 rounded-xl px-6 py-5 bg-blue-100 shadow-md hover:shadow-lg transition-all duration-200">
									<div className="flex justify-between items-start">
										<div>
											<h2 className="text-xl font-semibold text-gray-900 hover:text-blue-700">{problem.title}</h2>
											<div className="flex gap-2 flex-wrap mt-2 text-sm">
												{problem.tags.slice(0, 3).map((tag, idx) => (
													<span
														key={idx}
														className="bg-blue-100 text-blue-700 px-3 py-0.5 rounded-full text-xs font-medium"
													>
														#{tag}
													</span>
												))}
												<span className="text-gray-400 text-xs">Created: {formatDate(problem.createdAt)}</span>
											</div>
										</div>

										<span
											className={`text-xs px-3 py-1 rounded-full border font-medium ${getDifficultyColor(problem.difficulty)}`}
										>
											{problem.difficulty}
										</span>
									</div>
								</div>
							</NavLink>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ProblemPage;
