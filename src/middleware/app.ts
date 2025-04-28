import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "../routes/auth.route.js";
import blogRouter from "../routes/blog.route.js";
import postRouter from "../routes/post.route.js";
import commentRouter from "../routes/comment .route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/comments", commentRouter);

export default app;
