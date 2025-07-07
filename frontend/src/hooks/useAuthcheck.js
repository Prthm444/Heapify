import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useAuthCheck = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		const checkLogin = async () => {
			try {
				const res = await axios.get("http://127.0.0.1:8001/user/checklogin", {
					withCredentials: true,
				});
				dispatch(setUser({ user: res.data.data }));
				console.log("already logged in...", res.data.data);
				navigate("/problems");
			} catch (err) {
				dispatch(clearUser());
				console.log("Not logged in");
			}
		};

		checkLogin();
	}, []);
};

export default useAuthCheck;
