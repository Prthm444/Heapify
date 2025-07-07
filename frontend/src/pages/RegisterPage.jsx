import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		bio: "",
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://127.0.0.1:8001/user/register", formData);
			alert("Registration successful ");
			console.log(res.data);
			navigate("/login");
		} catch (error) {
			alert("Registration failed : " + error.message);
			console.error(error);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Register</h2>
				<input
					type="text"
					name="username"
					value={formData.username}
					onChange={handleChange}
					placeholder="Username"
					className="w-full mb-4 p-3 border rounded"
					required
				/>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Email"
					className="w-full mb-4 p-3 border rounded"
					required
				/>
				<input
					type="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					placeholder="Password"
					className="w-full mb-4 p-3 border rounded"
					required
				/>
				<textarea
					name="bio"
					value={formData.bio}
					onChange={handleChange}
					placeholder="Bio"
					className="w-full mb-4 p-3 border rounded"
					rows={3}
				></textarea>
				<input
					type="text"
					name="avatarUrl"
					value={formData.avatarUrl}
					onChange={handleChange}
					placeholder="Avatar URL (optional)"
					className="w-full mb-4 p-3 border rounded"
				/>
				<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
					Register
				</button>
			</form>
		</div>
	);
};

export default RegisterPage;
