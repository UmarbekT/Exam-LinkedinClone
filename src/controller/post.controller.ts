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
export const updatePost = async (req: Request, res: Response) => {
  try {
    const { id, title, content } = req.body;
    const userId = (req as any).user.id;

    if (!id || !title || !content) {
      return res.status(400).json({ message: "id, title va content kerak" });
    }

    const post = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ message: "Post topilmadi" });
    }

    if (post.rows[0].user_id !== userId) {
      return res.status(403).json({
        message: "Siz faqat o'zingizning postingizni o'zgartira olasiz",
      });
    }

    await pool.query(
      "UPDATE posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3",
      [title, content, id]
    );

    res.json({ message: "Post muvaffaqiyatli yangilandi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatosi" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const userId = (req as any).user.id;

    if (!id) {
      return res.status(400).json({ message: "Post id kerak" });
    }

    const post = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (post.rows.length === 0) {
      return res.status(404).json({ message: "Post topilmadi" });
    }

    if (post.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ message: "Siz faqat o'zingizning postingizni o'chira olasiz" });
    }

    await pool.query("DELETE FROM posts WHERE id = $1", [id]);

    res.json({ message: "Post muvaffaqiyatli o'chirildi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server xatosi" });
  }
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

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.post_id;

    await pool.query("UPDATE posts SET views = views + 1 WHERE id = $1", [
      postId,
    ]);

    const result = await pool.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);
    if (result.rows.length === 0 || 1) {
      return res.status(404).json({ message: "Post topilmadi" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi", error });
  }
};

export const sortPostsByDate = async (req: Request, res: Response) => {
  try {
    const { blog_id } = req.query;
    if (!blog_id) {
      return res.status(400).json({ message: "Blog ID kerak" });
    }

    const result = await pool.query(
      "SELECT * FROM posts WHERE blog_id = $1 ORDER BY created_at DESC",
      [blog_id]
    );
    console.log(result);

    if (result.rows.length === 0) throw new Error("Blog Topilmadi!");
    console.log();

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
}; //shunmadim nima xato bo'lyabdi

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.post_id;

    const result = await pool.query(
      `SELECT comments.*, users.email AS author_email 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       WHERE comments.post_id = $1 ORDER BY comments.created_at ASC`,
      [postId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Server xatosi" });
  }
};
