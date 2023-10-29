import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import {fileURLToPath} from 'url'
//configure env
//dotenv.config({path:"D:\E-commerce-App\.env"});   This is not working
dotenv.config(); // this works
//connecting databaseconfig
connectDB();

//esmodule fix
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename)
//creating a rest object
const app = express(); // app is an object of express

app.use(bodyParser.json({ limit: "10mb" }));

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));
//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

//creating rest apis
//get request
/*app.get("/", (req, res) => {
  // home route, req=request, res=response are parameters
  res.send("<h1>Welcome to Ecommerce app</h1>");
}); // end of get request
*/

//creating rest apis
app.use("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

//creating a port
const port = process.env.PORT || 9090; //PORT is the same variable in .env file
//if env doesn't work, 9090 is considered

//running the app
app.listen(port, () => {
  console.log(
    `Server running on ${process.env.dev} mode on ${port} successfully`.bgBlue
      .white
  );
});
