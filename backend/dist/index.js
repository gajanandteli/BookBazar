"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const profile_1 = __importDefault(require("./routes/profile"));
const wishlist_1 = __importDefault(require("./routes/wishlist"));
const messages_1 = __importDefault(require("./routes/messages"));
const books_1 = __importDefault(require("./routes/books"));
const auth_1 = __importDefault(require("./routes/auth"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
/* ==========================
   SOCKET.IO
========================== */
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000",
            "http://10.207.43.197:3000"
        ], methods: ["GET", "POST"]
    }
});
/* ==========================
   MIDDLEWARE
========================== */
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000",
        "http://10.207.43.197:3000"
    ],
    credentials: true,
}));
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((req, _res, next) => {
    console.log("BODY:", req.body);
    next();
});
app.use(express_1.default.urlencoded({ extended: true }));
/* ==========================
   RATE LIMITER
========================== */
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
/* ==========================
   STATIC UPLOADS
========================== */
app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads"), {
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
}));
/* ==========================
   ROUTES
========================== */
app.use("/api/auth", auth_1.default);
app.use("/api/books", books_1.default);
app.use("/api/profile", profile_1.default);
app.use("/api/wishlist", wishlist_1.default);
app.use("/api/messages", messages_1.default);
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
    socket.on("join", (userId) => {
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
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});
/* ==========================
   START SERVER
========================== */
const PORT = Number(process.env.PORT || 5000);
httpServer.listen(PORT, () => {
    console.log(`🚀 BookBazaar Backend running on http://localhost:${PORT}`);
});
