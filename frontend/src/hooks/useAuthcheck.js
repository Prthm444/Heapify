import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useAuthCheck = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const SERVER_URL = import.meta.env.VITE_SERVER_URL;

	useEffect(() => {
		const checkLogin = async () => {
			try {
				const res = await axios.get(`${SERVER_URL}/user/checklogin`, {
					withCredentials: true,
				});
				dispatch(setUser({ user: res.data.data }));
				//console.log("already logged in...", res.data.data);
				//toast.info("Already logged in..");
				navigate("/problems");
			} catch (err) {
				dispatch(clearUser());
				//toast.info("You need to log in!");
				//console.log("Not logged in");
			}
		};

		checkLogin();
	}, []);
};

export default useAuthCheck;
