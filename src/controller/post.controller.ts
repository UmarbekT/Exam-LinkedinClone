import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { pool } from "../config/db.js";

export const createPost = async (req: AuthRequest, res: Response) => {
  const { blogId, title, content } = req.body;
  const userId = req.user?.id;

  if (!blogId || !title)
    return res.status(400).json({ message: "Blog ID va sarlavha kerak" });

  const blogRes = await pool.query("SELECT * FROM blogs WHERE id = $1", [
    blogId,
  ]);
  if (blogRes.rows.length === 0)
    return res.status(404).json({ message: "Blog topilmadi" });
  if (blogRes.rows[0].owner_id !== userId)
    return res.status(403).json({ message: "Ruxsat yo'q" });

  await pool.query(
    "INSERT INTO posts (blog_id, title, content, author_id) VALUES ($1, $2, $3, $4)",
    [blogId, title, content, userId]
  );

  return res.status(201).json({ message: "Post yaratildi" });
};

export const getPostsByBlog = async (req: Request, res: Response) => {
  const { blogId } = req.query;
  if (!blogId) return res.status(400).json({ message: "Blog ID kerak" });

  const result = await pool.query(
    "SELECT * FROM posts WHERE blog_id = $1 ORDER BY created_at DESC",
    [blogId]
  );
  return res.json(result.rows);
};
