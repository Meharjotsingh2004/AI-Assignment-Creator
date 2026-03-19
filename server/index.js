import express from "express";
import http from "http"
import cors from "cors";
import dotenv from "dotenv"
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import {initSocket} from "./socket/index.js"
import router from "./routes/assignmentRoutes.js";


dotenv.config();

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
});

initSocket(io);
app.set("io", io);


//initSocket(io);

//middleWare
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(express.json());

app.use("/api/assignments", router);


//console.log(process.env.GEMINI_API_KEY);

connectDB().then(() => {
  httpServer.listen(process.env.PORT  , () =>
    console.log(`Server running on port ${process.env.PORT}`)
  );
});