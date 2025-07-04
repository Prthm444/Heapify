// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
	return (
		<>
			<Navbar />
			<main className="p-6">
				<Outlet />
			</main>
		</>
	);
};

export default Layout;
