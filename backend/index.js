import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import notificationRoute from "./routes/notification.route.js";
import path from 'path';

import { app, server } from "./socket/socket.js";


dotenv.config();


const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Connected to Server",
        success: true
    })
})
//dbPassword:OmSaiRam
//connectionString:mongodb+srv://dbUser:OmSaiRam@cluster0.rmrp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

const corsOptions = {
    origin: process.env.URL, //'http://localhost:5173',
    credentials: true,
}

app.use(cors(corsOptions))
app.use('/api/user', userRoute)
app.use('/api/post', postRoute);
app.use('/api/message', messageRoute);
app.use('/api/notification', notificationRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})
server.listen(PORT, () => {
    connectDB();
    console.log(`Server is running at port ${PORT}`)
})