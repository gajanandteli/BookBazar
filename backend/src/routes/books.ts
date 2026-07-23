import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { upload } from "../middleware/upload";
import { auth, AuthRequest } from "../middleware/auth";


const router = Router();
const prisma = new PrismaClient();

/* ==========================
   GET ALL BOOKS
========================== */
router.get("/", async (_req, res) => {
  try {
    const books = await prisma.book.findMany({
      where: {
        isSold: false,
      },
      include: {
        seller: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch books",
    });
  }
});
/* ==========================
   GET MY BOOKS
========================== */
router.get(
  "/my-books",
  auth,
  async (req: AuthRequest, res) => {
    try {
      const books = await prisma.book.findMany({
        where: {
          sellerId: req.userId,
        },
        include: {
          seller: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log("books:", books);

      return res.status(200).json(books);
    } catch (error) {
      console.error(error);


      return res.status(500).json({
        success: false,
        message: "Failed to fetch your books",
      });
    }
  }
);

/* ==========================
   GET BOOK BY ID
========================== */
router.get("/:id", async (req, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: {
        id: String(req.params.id),
      },
      include: {
        seller: true,
      },
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book",
    });
  }
});


/* ==========================
   CREATE BOOK
========================== */
router.post(
  "/",
  auth,
   upload.single("image"),
  async (req: AuthRequest, res) => {
    try {
      console.log("Body:", req.body);
      console.log("Files:", req.files);

      const seller = await prisma.user.findUnique({
        where: {
          id: req.userId,
        },
      });

      if (!seller) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

    const {
  title,
  author,
  category,
  description,
  price,
  location,
  phone,
} = req.body;

const imageUrl = req.file ? `http://10.207.43.197:5000/uploads/${req.file.filename}` : "";
      const book = await prisma.book.create({
        data: {
          title: title || "Untitled Book",
          author: author || "Unknown Author",
          category: category || "General",
          description: description || "",

          condition: "Good",

          price: Number(price) || 0,
          originalPrice: Number(price) || 0,

          negotiable: false,

          location: location || "Bhilwara",
          city: "Bhilwara",
          state: "Rajasthan",
          pincode: "311001",

          pickupAvailable: true,
          deliveryAvailable: true,

          phoneNumber: phone || "0000000000",
          whatsappNumber: phone || "0000000000",

          images: imageUrl,

          sellerId: seller.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Book uploaded successfully",
        book,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to create book",
      });
    }
  }
);

/* ==========================
   UPDATE BOOK
========================== */
router.put(
  "/:id",
  auth,
   upload.single("image"),
  async (req: AuthRequest, res) => {
    try {
      const book = await prisma.book.findUnique({
        where: {
          id: String(req.params.id),
        },
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }
  const imageUrl = req.file
  ? `http://10.207.43.197:5000/uploads/${req.file.filename}`
        : book.images;

      const {
        title,
        author,
        category,
        description,
        price,
        location,
        phone,
      } = req.body;

      const updatedBook = await prisma.book.update({
        where: {
          id: book.id,
        },
        data: {
          title,
          author,
          category,
          description,

          price: Number(price),
          originalPrice: Number(price),

          location,

          phoneNumber: phone,
          whatsappNumber: phone,

          images: imageUrl,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Book updated successfully",
        book: updatedBook,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to update book",
      });
    }
  }
);
router.patch("/:id/sold", auth, async (req: AuthRequest, res) => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: String(req.params.id) },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.sellerId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedBook = await prisma.book.update({
      where: { id: book.id },
      data: {
        isSold: true,
      },
    });

    return res.json(updatedBook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

/* ==========================
   DELETE BOOK
========================== */
router.delete(
  "/:id",
  auth,
  async (req: AuthRequest, res) => {
    try {
      const book = await prisma.book.findUnique({
        where: {
          id: String(req.params.id),
        },
      });

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      if (book.sellerId !== req.userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await prisma.book.delete({
        where: {
          id: book.id,
        },
      });

      return res.status(200).json({
        success: true,
        message: "Book deleted successfully",
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Failed to delete book",
      });
    }
  }
);
export default router;