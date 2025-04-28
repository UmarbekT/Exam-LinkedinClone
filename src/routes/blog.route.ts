import express from "express";
import * as blogController from "../controller/blog.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware as any); // bu ham huddi shunday inglizchasni yaxshi bilmaganim uchun chunmadim mana bu saytdan topdim javobini: https://stackoverflow.com/questions/70964519/typescript-no-overload-matches-this-call

router.post("/create", blogController.createBlog as any);
router.get("/my", blogController.getMyBlogs as any);
router.get("/joined", blogController.joinBlog as any);
router.get("/info", blogController.getBlogInfo as any);
router.put("/update", blogController.updateBlog as any);
router.delete("/delete", blogController.deleteBlog as any);
router.get("/search", blogController.searchBlogs as any);
router.post("/join", blogController.joinBlog as any);
router.post("/leave", blogController.leaveBlog as any);
router.get("/users", blogController.getUsers as any);

export default router;
