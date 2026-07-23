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
router.get("/api/profile", auth_1.auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.json(user);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});
router.put("/api/profile", auth_1.auth, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const updatedUser = await prisma.user.update({
            where: {
                id: req.userId,
            },
            data: {
                name,
                phone,
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                avatar: true,
                role: true,
                createdAt: true,
            },
        });
        return res.json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
});
exports.default = router;
