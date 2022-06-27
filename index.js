console.clear();

import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import accountRouter from './routes/accounts.js'
import authRouter from "./routes/auth.js";
import authTokenRouter from "./routes/auth-token.js";
import authSessionRouter from "./routes/auth-sesion.js";
import mongoose from "mongoose";


dotenv.config();

const PORT = process.env.PORT;
const expressApp = express();


// Middlewares
expressApp.use(cookieParser());
expressApp.use(express.json());
expressApp.use(express.text());
expressApp.use("/account", accountRouter);
expressApp.use("/auth", authRouter);
expressApp.use("/auth-token", authTokenRouter);
expressApp.use("/auth-session", authSessionRouter);

const bootstrap = async () => {
  await mongoose.connect(process.env.MONGODB_URL)

  expressApp.listen(PORT, () => {
    console.log(`Servidor levantado en el puerto ${PORT}`);
  });
}

bootstrap();
