import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ProblemPage from "./pages/ProblemPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./utils/Layout";
import ProblemDetailPage from "./pages/ProblemDetailPage";
const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{ index: true, element: <MainPage /> },
			{ path: "problems", element: <ProblemPage /> },
			{ path: "profile", element: <ProfilePage /> },
			{ path: "problems/:id", element: <ProblemDetailPage /> },
		],
	},
	{ path: "*", element: <NotFoundPage /> },
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
