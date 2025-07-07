import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/slices/userSlice";

export default function ProfilePage() {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const res = await axios.get("http://127.0.0.1:8001/user/info", { withCredentials: true });
				dispatch(setUser({ user: res.data.data }));
			} catch (err) {
				console.error("Error fetching user info:", err);
			}
		};
		fetchInfo();
	}, [dispatch]);

	if (!isLoggedIn) return <Navigate to="/login" replace />;
	if (!user) return <div>Loading...</div>;

	return (
		<div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
			<h1 className="text-3xl font-bold text-blue-700 mb-6">👤 Profile</h1>
			{/* Basic Info */}
			<div className="mb-6 space-y-2">
				<p>
					<strong>🆔 Username:</strong> {user.username}
				</p>
				<p>
					<strong>📧 Email:</strong> {user.email}
				</p>
				{user.bio && (
					<p>
						<strong>📝 Bio:</strong> {user.bio}
					</p>
				)}
				{user.avatarUrl && <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full mt-2 border" />}
				<p>
					<strong>👥 Friends:</strong> {user.friends?.length || 0}
				</p>
			</div>
			{/* Stats */}
			<div className="bg-gray-100 p-4 rounded shadow-inner">
				<h2 className="text-xl font-semibold text-gray-700 mb-2">📊 Coding Stats</h2>
				<p>
					<strong>✅ Problems Solved:</strong> {user.stats?.SolvedProblems?.length || 0}
				</p>
				<p>
					<strong>📤 Submissions:</strong> {user.stats?.Submissions?.length || 0}
				</p>
				<p>
					<strong>🎯 Accuracy:</strong> {user.stats?.accuracy?.toFixed(2) || 0}%
				</p>
				<p>
					<strong>💻 Languages Used:</strong> {user.stats?.languagesUsed?.join(", ") || "None"}
				</p>
			</div>
			{/* Role */}
			<p className="mt-4 text-sm text-gray-500">Role: {user.role}</p>
			{/* Timestamps */}
			<p className="text-xs mt-2 text-gray-400">Account created: {new Date(user.createdAt).toLocaleString()}</p>
		</div>
	);
}
