import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

const PORT = 8000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})