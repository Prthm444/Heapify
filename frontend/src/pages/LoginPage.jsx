import { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import useAuthCheck from "../hooks/useAuthcheck";
import { User, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

const LoginPage = () => {
	useAuthCheck();

	const [formData, setFormData] = useState({ identifier: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await axios.post(
				"http://localhost:8001/user/login",
				{
					username: formData.identifier,
					email: formData.identifier,
					password: formData.password,
				},
				{ withCredentials: true }
			);
			dispatch(setUser({ user: res.data.data.user }));
			alert("Login successful ✅");
			navigate("/problems");
		} catch (error) {
			alert("Login failed ❌");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-6 relative">
			{/* Soft background bubbles */}
			<div className="absolute inset-0 overflow-hidden z-0">
				<div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
				<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
			</div>

			{/* Form container */}
			<div className="relative z-10 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 max-w-md w-full border border-white/30">
				{/* Header */}
				<div className="text-center mb-6">
					<div className="mx-auto w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md mb-3">
						<Shield className="text-white w-8 h-8" />
					</div>
					<h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
					<p className="text-gray-600 text-sm">Sign in to continue</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Identifier */}
					<div>
						<label className="block text-sm text-gray-700 font-medium mb-1">Username or Email</label>
						<div className="relative">
							<User className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
							<input
								type="text"
								name="identifier"
								value={formData.identifier}
								onChange={handleChange}
								placeholder="Enter your username or email"
								required
								className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
							/>
						</div>
					</div>

					{/* Password */}
					<div>
						<label className="block text-sm text-gray-700 font-medium mb-1">Password</label>
						<div className="relative">
							<Lock className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								value={formData.password}
								onChange={handleChange}
								placeholder="Enter your password"
								required
								className="pl-10 pr-10 py-3 w-full border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white/90"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
							>
								{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
							</button>
						</div>
					</div>

					{/* Submit */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition flex items-center justify-center space-x-2 disabled:opacity-50"
					>
						{isLoading ? (
							<div className="flex items-center gap-2">
								<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
								<span>Signing in...</span>
							</div>
						) : (
							<div className="flex items-center gap-2">
								<span>Log In</span>
								<ArrowRight className="w-5 h-5" />
							</div>
						)}
					</button>

					{/* Divider */}
					<div className="text-center text-gray-500 text-sm my-4">or</div>

					{/* Register redirect */}
					<p className="text-center text-sm text-gray-600">
						Don’t have an account?{" "}
						<NavLink to="/register" className="text-blue-600 hover:underline hover:text-blue-700 font-medium">
							Sign up here
						</NavLink>
					</p>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
