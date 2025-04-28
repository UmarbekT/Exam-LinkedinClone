import { Router } from "express";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
  updateComment,
} from "../controller/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware as any);

router.post("/create", createComment as any);
router.get("/by-post", getCommentsByPost as any);
router.put("/update", updateComment as any);
router.delete("/delete", deleteComment as any);
export default router;
