import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";
import useAuthCheck from "../hooks/useAuthcheck";
import { NavLink } from "react-router-dom";

const LoginPage = () => {
	useAuthCheck();
	const [formData, setFormData] = useState({
		identifier: "",
		password: "",
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const dispatch = useDispatch();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"http://127.0.0.1:8001/user/login",
				{
					username: formData.identifier,
					email: formData.identifier,
					password: formData.password,
				},
				{ withCredentials: true }
			);

			//console.log(res.data);
			const { user } = res.data.data;
			dispatch(setUser({ user }));
			//console.log("redux : ", isLoggedIn);
			console.log(document.cookie);
			alert("Login successfull ");
			navigate("/problems");
		} catch (error) {
			alert("Login failed : ");
			console.error(error);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-gray-100">
			<form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Login</h2>
				<input
					type="text"
					name="identifier"
					value={formData.identifier}
					onChange={handleChange}
					placeholder="Username or Email"
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
				<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
					Log In
				</button>
				<NavLink to="/register" className="text-blue-600 mt-4 hover:underline">
					Don't have an account? Register here
				</NavLink>
			</form>
		</div>
	);
};

export default LoginPage;
