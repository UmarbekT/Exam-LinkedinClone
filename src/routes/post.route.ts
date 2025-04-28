import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPostsByBlog,
  sortPostsByDate,
  updatePost,
} from "../controller/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getCommentsByPost } from "../controller/comment.controller.js";

const router = Router();

router.use(authMiddleware as any);

router.post("/create", createPost as any);
router.get("/by-blog", getPostsByBlog as any);
router.get("/:post_id", getPostById as any);
router.put("/update", updatePost as any);
router.delete("/delete", deletePost as any);
router.get("/sort-by-date", sortPostsByDate as any);
router.get("/:post_id/get-comments", getCommentsByPost as any);

export default router;
