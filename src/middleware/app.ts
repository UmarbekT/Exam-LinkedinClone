import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: "Success",
//     message: "Salom sen bu yerda nima qilvosan?! ===> /api/v1/auth",
//   });
// });

export default app;
