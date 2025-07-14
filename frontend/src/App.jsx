import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./utils/Layout";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
axios.defaults.withCredentials = true;
import { ToastContainer } from "react-toastify";
import AddProblemPage from "./pages/AddProblemPage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <ProblemPage /> },
			{ path: "problems", element: <ProblemPage /> },
			{ path: "profile", element: <ProfilePage /> },
			{ path: "problems/:id", element: <ProblemDetailPage /> },
			{ path: "login", element: <LoginPage /> },
			{ path: "register", element: <RegisterPage /> },
			{ path: "add-problem", element: <AddProblemPage /> },
			{ path: "submissions", element: <MySubmissionsPage /> },
		],
	},
	{ path: "*", element: <NotFoundPage /> },
]);

function App() {
	return (
		<>
			<RouterProvider router={router} />;
			<ToastContainer
				position="bottom-right"
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={false}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</>
	);
}

export default App;
