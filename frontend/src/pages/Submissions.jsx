import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function SubmissionsPage() {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

	if (!isLoggedIn) return <Navigate to="/login" replace />;
	return (
		<div className="main-page">
			<h1>Welcome to the Submissions page</h1>
			<p>This is the main content area.</p>
		</div>
	);
}
