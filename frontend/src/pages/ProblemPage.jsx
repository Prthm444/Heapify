import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
const ProblemPage = () => {
	const [problems, setProblems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProblems = async () => {
			try {
				const res = await axios.get("http://localhost:8001/problems/list");
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

	const formatDate = (isoDate) => {
		return new Date(isoDate).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	};

	const getDifficultyColor = (difficulty) => {
		switch (difficulty) {
			case "Easy":
				return "text-green-600 bg-green-100";
			case "Medium":
				return "text-yellow-700 bg-yellow-100";
			case "Hard":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold text-blue-700 mb-4">Problems</h1>

			{loading && <p className="text-gray-500">Loading...</p>}
			{error && <p className="text-red-500">{error}</p>}

			{problems.length > 0 && (
				<div className="space-y-4">
					{problems.map((problem) => (
						<NavLink to={`/problems/${problem._id}`} className="no-underline" key={problem._id}>
							<div key={problem._id} className="border border-gray-200 rounded-md p-4 shadow-sm hover:shadow transition">
								<div className="flex justify-between items-start">
									<h2 className="text-lg font-semibold text-blue-700">{problem.title}</h2>
									<span className={`px-2 py-1 rounded text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
										{problem.difficulty}
									</span>
								</div>

								<div className="mt-2 flex flex-wrap gap-2 text-sm">
									{problem.tags.slice(0, 2).map((tag, idx) => (
										<span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
											{tag}
										</span>
									))}
								</div>

								<p className="text-sm text-gray-500 mt-2">Created on: {formatDate(problem.createdAt)}</p>
							</div>
						</NavLink>
					))}
				</div>
			)}
		</div>
	);
};

export default ProblemPage;
