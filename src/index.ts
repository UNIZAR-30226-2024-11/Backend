import express from "express";
import router from "./api";

const PORT = process.env.PORT || 8000;

const app = express();

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
