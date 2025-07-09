import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { setUser } from "../redux/slices/userSlice";
import { User, Mail, Calendar, Users, Award, Code, Target, Languages, Shield, Edit } from "lucide-react";

export default function ProfilePage() {
	const dispatch = useDispatch();
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		const fetchInfo = async () => {
			try {
				const res = await axios.get("http://localhost:8001/user/info", { withCredentials: true });
				dispatch(setUser({ user: res.data.data }));
			} catch (err) {
				console.error("Error fetching user info:", err);
			}
		};
		fetchInfo();
	}, [dispatch]);

	if (!isLoggedIn) return <Navigate to="/login" replace />;
	if (!user) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
				<div className="flex flex-col items-center space-y-4">
					<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					<p className="text-gray-600 font-medium">Loading your profile...</p>
				</div>
			</div>
		);
	}

	const getRoleColor = (role) => {
		switch (role?.toLowerCase()) {
			case "admin":
				return "bg-red-100 text-red-700 border-red-200";
			case "moderator":
				return "bg-yellow-100 text-yellow-700 border-yellow-200";
			case "premium":
				return "bg-purple-100 text-purple-700 border-purple-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	const getAccuracyColor = (accuracy) => {
		if (accuracy >= 90) return "text-green-600";
		if (accuracy >= 70) return "text-yellow-600";
		return "text-red-600";
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
			<div className="max-w-5xl mx-auto">
				{/* Header Card */}
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
					<div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white relative">
						<div className="absolute top-4 right-4"></div>
						<div className="flex items-center space-x-6">
							<div className="relative">
								{user.avatarUrl ? (
									<img
										src={user.avatarUrl}
										alt="User Avatar"
										className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg"
									/>
								) : (
									<div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center">
										<User className="w-12 h-12 text-white/80" />
									</div>
								)}
								<div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
									<div className="w-3 h-3 bg-white rounded-full"></div>
								</div>
							</div>
							<div className="flex-1">
								<h1 className="text-4xl font-bold mb-2">{user.username}</h1>
								<div className="flex items-center space-x-4 text-white/90">
									<div className="flex items-center space-x-2">
										<Mail className="w-4 h-4" />
										<span>{user.email}</span>
									</div>
									<div className="flex items-center space-x-2">
										<Calendar className="w-4 h-4" />
										<span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
									</div>
								</div>
								<div className={`inline-flex items-center space-x-2 mt-3 px-3 py-1 rounded-full border ${getRoleColor(user.role)}`}>
									<Shield className="w-4 h-4" />
									<span className="text-sm font-medium capitalize">{user.role}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Profile Details */}
					<div className="lg:col-span-1 space-y-6">
						{/* Bio Card */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
								<User className="w-5 h-5 mr-2 text-blue-600" />
								About
							</h2>
							{user.bio ? (
								<p className="text-gray-600 leading-relaxed">{user.bio}</p>
							) : (
								<p className="text-gray-400 italic">No bio available</p>
							)}
						</div>

						{/* Friends Card */}
						<div className="bg-white rounded-2xl shadow-lg p-6">
							<h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
								<Users className="w-5 h-5 mr-2 text-green-600" />
								Social
							</h2>
							<div className="flex items-center justify-between">
								<span className="text-gray-600">Friends</span>
								<span className="text-2xl font-bold text-green-600">{user.friends?.length || 0}</span>
							</div>
						</div>
					</div>

					{/* Right Column - Stats */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-2xl shadow-lg p-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
								<Award className="w-6 h-6 mr-3 text-purple-600" />
								Coding Statistics
							</h2>

							{/* Stats Grid */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
								<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											<Code className="w-5 h-5 text-blue-600" />
											<span className="font-medium text-gray-700">Problems Solved</span>
										</div>
									</div>
									<div className="text-3xl font-bold text-blue-600">{user.stats?.SolvedProblems?.length || 0}</div>
								</div>

								<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											<Target className="w-5 h-5 text-green-600" />
											<span className="font-medium text-gray-700">Submissions</span>
										</div>
									</div>
									<div className="text-3xl font-bold text-green-600">{user.stats?.Submissions?.length || 0}</div>
								</div>

								<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											<Award className="w-5 h-5 text-purple-600" />
											<span className="font-medium text-gray-700">Accuracy</span>
										</div>
									</div>
									<div className={`text-3xl font-bold ${getAccuracyColor(user.stats?.accuracy || 0)}`}>
										{user.stats?.accuracy?.toFixed(2) || 0}%
									</div>
								</div>

								<div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
									<div className="flex items-center justify-between mb-2">
										<div className="flex items-center space-x-2">
											<Languages className="w-5 h-5 text-orange-600" />
											<span className="font-medium text-gray-700">Languages</span>
										</div>
									</div>
									<div className="text-3xl font-bold text-orange-600">{user.stats?.languagesUsed?.length || 0}</div>
								</div>
							</div>

							{/* Languages List */}
							{user.stats?.languagesUsed?.length > 0 && (
								<div className="border-t pt-6">
									<h3 className="text-lg font-semibold text-gray-800 mb-4">Programming Languages</h3>
									<div className="flex flex-wrap gap-2">
										{user.stats.languagesUsed.map((language, index) => (
											<span
												key={index}
												className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
											>
												{language}
											</span>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
