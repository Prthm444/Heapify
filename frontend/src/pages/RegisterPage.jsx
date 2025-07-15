import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { User, Lock, Mail, Info, Image, UserPlus, ArrowRight } from "lucide-react";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		bio: "",
		avatarUrl: "",
	});
	const navigate = useNavigate();
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(`${SERVER_URL}/user/register`, formData);
			alert("Registration successful ✅");
			console.log(res.data);
			navigate("/login");
		} catch (error) {
			alert("Registration failed ❌ " + error.message);
			console.error(error);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center p-6 relative">
			{/* Background bubbles */}
			<div className="absolute inset-0 overflow-hidden z-0">
				<div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
			</div>

			{/* Registration Card */}
			<div className="relative z-10 bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl w-full max-w-md p-8">
				<div className="text-center mb-6">
					<div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md mb-3">
						<UserPlus className="text-white w-8 h-8" />
					</div>
					<h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
					<p className="text-sm text-gray-600">Join Heapify and start solving problems</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Username */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
						<div className="relative">
							<User className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
								placeholder="Enter username"
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
								required
							/>
						</div>
					</div>

					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<div className="relative">
							<Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
								placeholder="you@example.com"
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
								required
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
						<div className="relative">
							<Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
							<input
								type="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Create a password"
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
								required
							/>
						</div>
					</div>

					{/* Bio */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
						<div className="relative">
							<Info className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
							<textarea
								name="bio"
								value={formData.bio}
								onChange={handleChange}
								placeholder="A short description about you"
								rows={2}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
							></textarea>
						</div>
					</div>

					{/* Avatar URL */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL (optional)</label>
						<div className="relative">
							<Image className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
							<input
								type="text"
								name="avatarUrl"
								value={formData.avatarUrl}
								onChange={handleChange}
								placeholder="https://example.com/avatar.png"
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
							/>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
					>
						Register <ArrowRight className="w-5 h-5" />
					</button>

					{/* Already have account */}
					<p className="text-center text-sm text-gray-600 mt-2">
						Already have an account?{" "}
						<NavLink to="/login" className="text-blue-600 hover:underline hover:text-blue-700 font-medium">
							Log in
						</NavLink>
					</p>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
