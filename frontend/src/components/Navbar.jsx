// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

const Navbar = () => {
	const navLinkClass = ({ isActive }) =>
		`px-4 py-2 rounded-md font-medium transition ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`;

	return (
		<nav className="bg-white shadow w-full px-6 py-4 flex justify-between items-center">
			<h1 className="text-2xl font-bold text-blue-700">Heapify</h1>
			<div className="flex gap-4">
				<NavLink to="/" className={navLinkClass}>
					Home
				</NavLink>
				<NavLink to="/problems" className={navLinkClass}>
					Problems
				</NavLink>
				<NavLink to="/profile" className={navLinkClass}>
					Profile
				</NavLink>
			</div>
		</nav>
	);
};

export default Navbar;
