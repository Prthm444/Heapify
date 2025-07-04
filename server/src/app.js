import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//import { registerUser,loginUser } from "./controllers/user.controllers.js";
import UserRouter from "./routes/user.routes.js";
import ProblemRouter from "./routes/problem.routes.js";
import friendRequestRouter from "./routes/friendRequest.routes.js";
import SubmissionRouter from "./routes/submission.routes.js";
const app = express();

app.use(
	cors({
		origin: "http://localhost:5173", // your Vite frontend
		credentials: true, // if using cookies
	})
);
app.use(express.urlencoded({ extended: true }));
//middlewares
app.use(express.json({ limit: "16kb" })); // limiting payload for preventing large payloads incase of DOS attacks
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/heapify/test", (req, res) => {
	res.status(200).send("hii from server, I am alive btw");
});

// TODO routing

app.use("/user", UserRouter);
app.use("/problems", ProblemRouter);
app.use("/friendrequests", friendRequestRouter);
app.use("/submissions", SubmissionRouter);
export { app };
