import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/api/profile", auth, async (req: AuthRequest, res) => {
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.put("/api/profile", auth, async (req: AuthRequest, res) => {
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
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

export default router;