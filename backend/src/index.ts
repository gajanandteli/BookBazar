import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import profileRouter from "./routes/profile";
import wishlistRouter from "./routes/wishlist";
import messagesRouter from "./routes/messages";
import booksRouter from "./routes/books";
import authRouter from "./routes/auth";

import { createServer } from "http";
import { Server } from "socket.io";

import path from "path";

dotenv.config();

const app = express();
const httpServer = createServer(app);

/* ==========================
   SOCKET.IO
========================== */
const io = new Server(httpServer, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  }
});
/* ==========================
   MIDDLEWARE
========================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use((req, _res, next) => {
  console.log("BODY:", req.body);
  next();
});
app.use(express.urlencoded({ extended: true }));

/* ==========================
   RATE LIMITER
========================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

/* ==========================
   STATIC UPLOADS
========================== */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Cross-Origin-Resource-Policy",
        "cross-origin"
      );
    },
  })
);
/* ==========================
   ROUTES
========================== */
app.use("/api/auth", authRouter);
app.use("/api/books", booksRouter);
app.use("/api/profile", profileRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/messages", messagesRouter);
/* ==========================
   HEALTH CHECK
========================== */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "bookbazaar-backend",
  });
});
app.get("/hello", (_req, res) => {
  res.send("HELLO BOOKBAZAAR");
});
/* ==========================
   SOCKET EVENTS
========================== */
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);
  });

  socket.on("sendMessage", (message) => {
    io.to(message.receiverId).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});
/* ==========================
   404 HANDLER
========================== */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ==========================
   ERROR HANDLER
========================== */
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
);

/* ==========================
   START SERVER
========================== */
const PORT = Number(process.env.PORT || 5000);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 BookBazaar Backend running on http://localhost:${PORT}`
  );
});