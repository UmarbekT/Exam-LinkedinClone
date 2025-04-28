import express from "express";
const app = express();
app.use("/", (req, res, next) => {
    res.status(200).json({
        status: "Success",
        message: "Salom sen bu yerda nima qilib yuribsan tez crudni ishlad!",
    });
});
export default app;
