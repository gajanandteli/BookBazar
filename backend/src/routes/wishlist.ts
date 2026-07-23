import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();
router.post("/", auth, async (req: AuthRequest, res) => {
  try {
    const { bookId } = req.body;

    const exists = await prisma.wishlist.findFirst({
      where: {
          userId: req.userId!,
          bookId,
        },
      },
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Book already in wishlist",
      });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: req.userId!,
        bookId,
      },
    });

    return res.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: req.userId!,
      },
      include: {
        book: true,
      },
    });

    return res.json(wishlist);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.delete("/:bookId", auth, async (req: AuthRequest, res) => {
  try {
    const bookId  = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId;

    await prisma.wishlist.deleteMany({
      where: {

          userId: req.userId!,
          bookId: bookId,
        },
    });

    return res.json({
      success: true,
      message: "Book removed from wishlist",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

export default router;