import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
//middlewares

app.use(express.json());
app.use(cookieParser());
app.use

const PORT = 8000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})