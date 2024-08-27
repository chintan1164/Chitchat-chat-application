// const express = require('express')
// const dotenv = require('dotenv');
// const connectDB = require('./config/database.js');

import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoute from './routes/userRoute.js'
import messageRoute from './routes/messageRoute.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { app, server } from "./socket/socket.js";

dotenv.config({});

// const app = express();   
const PORT = process.env.PORT || 7000;

const __filename = fileURLToPath(import.meta.url);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOption = {
    origin: ['http://localhost:3000', 'https://chitchat-chat-application.vercel.app'],
    credentials: true
}

app.use(cors(corsOption));

app.use("/api/v1/user/", userRoute);
app.use("/api/v1/message", messageRoute);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});

// npm run dev
