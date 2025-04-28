import dotenv from "dotenv";
dotenv.config();
import app from "./middleware/app.js";
app.listen(process.env.PORT || 4325, () => {
    console.log(`Server listening on ${process.env.PORT || 4325}`);
});
