import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { pool } from "../config/db.js";

export const createBlog = async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body;
  const userId = req.user?.id;

  if (!title) return res.status(400).json({ message: "Blog nomi kerak" });

  await pool.query(
    "INSERT INTO blogs (title, description, owner_id) VALUES ($1, $2, $3)",
    [title, description, userId]
  );

  return res.status(201).json({ message: "Blog yaratildi" });
};

export const getMyBlogs = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const result = await pool.query("SELECT * FROM blogs WHERE owner_id = $1", [
    userId,
  ]);
  return res.json(result.rows);
};

export const getMyJoinedBlogs = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const result = await pool.query(
    `SELECT b.* FROM blogs b
    JOIN blog_members bm ON b.id = bm.blog_id
    WHERE bm.user_id = $1`,
    [userId]
  );
  return res.json(result.rows);
};

export const getBlogInfo = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.query;
  if (!blogId) return res.status(400).json({ message: "Blog ID kerak" });

  const blogRes = await pool.query("SELECT * FROM blogs WHERE id = $1", [
    blogId,
  ]);
  const blog = blogRes.rows[0];
  if (!blog) return res.status(404).json({ message: "Blog topilmadi" });

  const membersRes = await pool.query(
    `SELECT u.id, u.email FROM users u
     JOIN blog_members bm ON u.id = bm.user_id
     WHERE bm.blog_id = $1`,
    [blogId]
  );

  return res.json({ blog, members: membersRes.rows });
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  const { blogId, title, description } = req.body;
  const userId = req.user?.id;

  if (!blogId) return res.status(400).json({ message: "Blog ID kerak" });

  const blogRes = await pool.query("SELECT * FROM blogs WHERE id = $1", [
    blogId,
  ]);
  const blog = blogRes.rows[0];
  if (!blog) return res.status(404).json({ message: "Blog topilmadi" });

  if (blog.owner_id !== userId)
    return res.status(403).json({ message: "Ruxsat yo'q" });

  await pool.query(
    "UPDATE blogs SET title = $1, description = $2 WHERE id = $3",
    [title || blog.title, description || blog.description, blogId]
  );

  return res.json({ message: "Blog yangilandi" });
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.body;
  const userId = req.user?.id;

  if (!blogId) return res.status(400).json({ message: "Blog ID kerak" });

  const blogRes = await pool.query("SELECT * FROM blogs WHERE id = $1", [
    blogId,
  ]);
  const blog = blogRes.rows[0];
  if (!blog) return res.status(404).json({ message: "Blog topilmadi" });

  if (blog.owner_id !== userId)
    return res.status(403).json({ message: "Ruxsat yo'q" });

  await pool.query("DELETE FROM blogs WHERE id = $1", [blogId]);
  return res.json({ message: "Blog o'chirildi" });
};

export const searchBlogs = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q || typeof q !== "string")
    return res.status(400).json({ message: "So'z kiriting" });

  const result = await pool.query("SELECT * FROM blogs WHERE title ILIKE $1", [
    `%${q}%`,
  ]);
  return res.json(result.rows);
};

export const joinBlog = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.body;
  const userId = req.user?.id;

  if (!blogId) return res.status(400).json({ message: "Blog ID kerak" });

  const exists = await pool.query(
    "SELECT * FROM blog_members WHERE blog_id = $1 AND user_id = $2",
    [blogId, userId]
  );
  if (exists.rows.length > 0)
    return res.status(400).json({ message: "Siz allaqachon a'zosiz" });

  await pool.query(
    "INSERT INTO blog_members (blog_id, user_id) VALUES ($1, $2)",
    [blogId, userId]
  );

  return res.json({ message: "Blogga qo'shildingiz" });
};

export const leaveBlog = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.body;
  const userId = req.user?.id;

  if (!blogId) return res.status(400).json({ message: "Blog ID kerak" });

  await pool.query(
    "DELETE FROM blog_members WHERE blog_id = $1 AND user_id = $2",
    [blogId, userId]
  );

  return res.json({ message: "Blogdan chiqib ketdingiz" });
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  const { blogId } = req.query;
  if (!blogId) return res.status(400).json({ message: "Blog ID kerak" });

  const membersRes = await pool.query(
    `SELECT u.id, u.email FROM users u
     JOIN blog_members bm ON u.id = bm.user_id
     WHERE bm.blog_id = $1`,
    [blogId]
  );

  return res.json(membersRes.rows);
};
