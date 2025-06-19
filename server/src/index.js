import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB();

dotenv.config({
  path: "./.env",
});

//console.log(process.env.PORT);

app.listen(8001, () => {
  console.log("Server is listening....");
});
