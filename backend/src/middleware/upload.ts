import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: "bookbazaar",
    resource_type: "image",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

export const upload = multer({ storage });