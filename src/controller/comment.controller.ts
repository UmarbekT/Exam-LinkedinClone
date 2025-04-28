import { Request, Response } from "express";
import { AuthRequest } from "middleware/auth.middleware.ts";
import { pool } from "config/db.ts";

export const createComment = async (req: AuthRequest, res: Response) => {
  const { postId, content } = req.body;
  const userId = req.user?.id;

  if (!postId || !content)
    return res.status(400).json({ message: "Post ID va matn kerak" });

  const postRes = await pool.query("SELECT * FROM posts WHERE id = $1", [
    postId,
  ]);
  if (postRes.rows.length === 0)
    return res.status(404).json({ message: "Post topilmadi" });

  await pool.query(
    "INSERT INTO comments (post_id, content, author_id) VALUES ($1, $2, $3)",
    [postId, content, userId]
  );

  return res.status(201).json({ message: "Komment yozildi" });
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.query;
  if (!postId) return res.status(400).json({ message: "Post ID kerak" });

  const result = await pool.query(
    `SELECT c.*, u.email AS author_email FROM comments c
     JOIN users u ON c.author_id = u.id
     WHERE c.post_id = $1
     ORDER BY c.created_at ASC`,
    [postId]
  );
  return res.json(result.rows);
};
