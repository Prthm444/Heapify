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
				return "bg-green-100 text-green-800 border-green-300";
			case "Medium":
				return "bg-yellow-100 text-yellow-800 border-yellow-300";
			case "Hard":
				return "bg-red-100 text-red-800 border-red-300";
			default:
				return "bg-gray-100 text-gray-800 border-gray-300";
		}
	};

	if (!isLoggedIn) return <Navigate to="/login" replace />;

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 px-6 py-10 overflow-hidden">
			<NavLink to="/add-problem">
				<button className="fixed bottom-8 right-8 px-6 py-3 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-medium transition-all duration-300 backdrop-blur-md backdrop-brightness-90">
					Add New Problem
				</button>
			</NavLink>

			

			{/* Floating Blurs */}
			<div className="absolute top-[-6rem] left-[-6rem] w-60 h-60 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse" />
			<div className="absolute bottom-[-6rem] right-[-6rem] w-60 h-60 bg-blue-300 rounded-full opacity-20 blur-3xl animate-pulse" />

			<h1 className="text-4xl font-extrabold text-blue-800 mb-8 text-center"> Practice Problems</h1>

			{loading && <div className="text-center text-gray-600 font-medium animate-pulse">Fetching problems...</div>}

			{error && <p className="text-red-600 text-center">{error}</p>}

			{problems.length > 0 && (
				<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
					{problems.map((problem) => (
						<NavLink key={problem._id} to={`/problems/${problem._id}`} className="group transition-transform transform hover:-translate-y-1">
							<div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-blue-200 transition-all duration-200">
								<div className="flex justify-between items-start mb-2">
									<h2 className="text-xl font-bold text-blue-800 group-hover:underline">{problem.title}</h2>
									<span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(problem.difficulty)}`}>
										{problem.difficulty}
									</span>
								</div>

								{/* Tags */}
								<div className="flex flex-wrap gap-2 mb-2">
									{problem.tags.slice(0, 2).map((tag, idx) => (
										<span key={idx} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
											#{tag}
										</span>
									))}
								</div>

								<p className="text-xs text-gray-500 mt-1"> Created on: {formatDate(problem.createdAt)}</p>
							</div>
						</NavLink>
					))}
				</div>
			)}
		</div>
	);
};

export default ProblemPage;
