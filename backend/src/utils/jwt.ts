import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "bookbazaar_secret";

export const generateToken = (id: string) => {
  return jwt.sign(
    { id },
    SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET);
};