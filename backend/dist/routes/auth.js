"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
console.log("✅ AUTH ROUTES LOADED");
/* ==========================
   SIGNUP
========================== */
router.post("/signup", async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, Email and Password are required",
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
            },
        });
        const token = (0, jwt_1.generateToken)(user.id);
        return res.status(201).json({
            success: true,
            message: "Signup successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Signup failed",
        });
    }
});
/* ==========================
   LOGIN
========================== */
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and Password are required",
            });
        }
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const token = (0, jwt_1.generateToken)(user.id);
        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login failed",
        });
    }
});
/* ==========================
   GET CURRENT USER
========================== */
router.get("/me", auth_1.auth, async (req, res) => {
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
                isVerified: true,
            },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
        });
    }
});
/* ==========================
   GOOGLE LOGIN (Placeholder)
========================== */
router.post("/google", (_req, res) => {
    res.json({
        success: true,
        message: "Google Login will be added soon",
    });
});
/* ==========================
   EMAIL OTP (Placeholder)
========================== */
router.post("/email/send-otp", (_req, res) => {
    res.json({
        success: true,
        message: "Email OTP feature coming soon",
    });
});
router.post("/email/verify-otp", (_req, res) => {
    res.json({
        success: true,
        message: "Email OTP verification coming soon",
    });
});
/* ==========================
   MOBILE OTP (Placeholder)
========================== */
router.post("/mobile/send-otp", (_req, res) => {
    res.json({
        success: true,
        message: "Mobile OTP feature coming soon",
    });
});
router.post("/mobile/verify-otp", (_req, res) => {
    res.json({
        success: true,
        message: "Mobile OTP verification coming soon",
    });
});
exports.default = router;
