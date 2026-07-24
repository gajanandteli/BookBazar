import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();
router.post("/", auth, async (req: AuthRequest, res) => {
  const { receiverId, text } = req.body;

  const message = await prisma.message.create({
    data: {
      senderId: req.userId!,
      receiverId,
      text,
    },
  });

  res.json(message);
});
router.get("/:userId", auth, async (req: AuthRequest, res) => {
  const otherUserId = String(req.params.userId);
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        {
          senderId: req.userId!,
          receiverId: otherUserId,
        },
        {
          senderId: otherUserId,
          receiverId: req.userId!,
        },
      ],
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  res.json(messages);
});
export default router;