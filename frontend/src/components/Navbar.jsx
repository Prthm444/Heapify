import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../redux/slices/userSlice";
import axios from "axios";

const Navbar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.user);
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

	const navLinkClass = ({ isActive }) =>
		`px-4 py-2 rounded-md font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`;

	const handleLogout = async () => {
		try {
			const logout = await axios.get("http://127.0.0.1:8001/user/logout", {
				withCredentials: true,
			});
			dispatch(clearUser());
			console.log("Logout successful:", logout.data);
			alert("Logout successful");
			// const res2 = await axios.get("http://127.0.0.1:8001/user/checklogin", { withCredentials: true });
			// console.log("Check login after logout:", res2.data);
			navigate("/login");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	return (
		<nav className="bg-white shadow w-full px-6 py-4 flex justify-between items-center">
			<h1 className="text-2xl font-bold text-blue-700">Heapify</h1>
			<div className="flex gap-4 items-center">
				<NavLink to="/" className={navLinkClass}>
					Home
				</NavLink>
				<NavLink to="/problems" className={navLinkClass}>
					Problems
				</NavLink>
				<NavLink to="/profile" className={navLinkClass}>
					{user ? user.username : "Profile"}
				</NavLink>

				{/* Show Logout if logged in */}
				{isLoggedIn ? (
					<button onClick={handleLogout} className="px-4 py-2 rounded-md font-medium text-red-600 hover:bg-gray-100 transition">
						Log out
					</button>
				) : (
					<NavLink to="/login" className={navLinkClass}>
						Login
					</NavLink>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
