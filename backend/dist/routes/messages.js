"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/api/messages", auth_1.auth, async (req, res) => {
    const { receiverId, text } = req.body;
    const message = await prisma.message.create({
        data: {
            senderId: req.userId,
            receiverId,
            text,
        },
    });
    res.json(message);
});
router.get("/api/messages/:userId", auth_1.auth, async (req, res) => {
    const otherUserId = String(req.params.userId);
    const messages = await prisma.message.findMany({
        where: {
            OR: [
                {
                    senderId: req.userId,
                    receiverId: otherUserId,
                },
                {
                    senderId: otherUserId,
                    receiverId: req.userId,
                },
            ],
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    res.json(messages);
});
exports.default = router;
