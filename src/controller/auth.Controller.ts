import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "config/db.ts";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "secretkey";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email va parol kerak" });

  const existing = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rows.length > 0)
    return res.status(400).json({ message: "Email band" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
    [email, hashedPassword, "user"]
  );

  return res.status(201).json({ message: "Ro'yxatdan o'tildi" });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email va parol kerak" });

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = result.rows[0];
  if (!user) return res.status(400).json({ message: "Email noto'g'ri" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ message: "Parol noto'g'ri" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.cookie("token", token, { httpOnly: true });
  return res.json({ message: "Login muvaffaqiyatli" });
};
