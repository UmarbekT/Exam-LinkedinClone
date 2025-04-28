import { Router } from "express";
import {
  createComment,
  getCommentsByPost,
} from "../controller/comment.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware as any);

router.post("/create", createComment as any);
router.get("/by-post", getCommentsByPost as any);

export default router;
