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
router.post("/", auth_1.auth, async (req, res) => {
    try {
        const { bookId } = req.body;
        const exists = await prisma.wishlist.findFirst({
            where: {
                userId: req.userId,
                bookId,
            },
        });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Book already in wishlist",
            });
        }
        const wishlist = await prisma.wishlist.create({
            data: {
                userId: req.userId,
                bookId,
            },
        });
        return res.json({
            success: true,
            wishlist,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});
router.get("/", auth_1.auth, async (req, res) => {
    try {
        const wishlist = await prisma.wishlist.findMany({
            where: {
                userId: req.userId,
            },
            include: {
                book: true,
            },
        });
        return res.json(wishlist);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});
router.delete("/:bookId", auth_1.auth, async (req, res) => {
    try {
        const bookId = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId;
        await prisma.wishlist.deleteMany({
            where: {
                userId: req.userId,
                bookId: bookId,
            },
        });
        return res.json({
            success: true,
            message: "Book removed from wishlist",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});
exports.default = router;
