import { Router } from "express";
import { createPost, getPostsByBlog } from "../controller/post.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authMiddleware as any);

router.post("/create", createPost as any);
router.get("/by-blog", getPostsByBlog as any);

export default router;
