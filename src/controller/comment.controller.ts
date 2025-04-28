import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { pool } from "../config/db.js";

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

export const updateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.body.id;
    const newText = req.body.text;

    if (!commentId || !newText) {
      return res.status(400).json({ message: "Comment ID va text kerak" });
    }

    const commentCheck = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: "Comment topilmadi" });
    }

    await pool.query(
      "UPDATE comments SET text = $1, updated_at = NOW() WHERE id = $2",
      [newText, commentId]
    );

    return res.json({ message: "Comment yangilandi" });
  } catch (error) {
    console.error("Update comment error:", error);
    return res.status(500).json({ message: "Server xatosi" });
  }
};

export const deleteComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.query.id;

    if (!commentId) {
      return res.status(400).json({ message: "Comment ID kerak" });
    }

    const commentCheck = await pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentId]
    );

    if (commentCheck.rows.length === 0) {
      return res.status(404).json({ message: "Comment topilmadi" });
    }

    await pool.query("DELETE FROM comments WHERE id = $1", [commentId]);

    return res.json({ message: "Comment o'chirildi" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Server xatosi" });
  }
};
