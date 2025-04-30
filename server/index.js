import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoute from "./routes/user_route.js";

dotenv.config();
const app = express();

//middlewares
app.use(express.json()); //Parses JSON payloads from request body.
app.use(express.urlencoded({extended:true})); //Parses URL-encoded payloads (e.g., forms).
app.use(cookieParser()); //Parses cookies from incoming HTTP requests

const corsOptions = {
    origin: ' http://localhost:5173/',
  credentials: true, // Ensures cookies are sent
};
app.use(cors(corsOptions));

app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT || 3000;
 app.listen (PORT,()=>{
    connectDB();
    console.log(`Server Running at Port ${PORT}`);
 });