const express = require("express");
require("dotenv").config();
const { connectDB } = require("./utils/connectDB");
const { initModel } = require("./services/modelEndpoints");
const userRouter = require("./routes/userRoutes");
const materialRouter = require("./routes/materialRoutes");
const lessonRouter = require("./routes/lessonRoutes");
const quizRouter = require("./routes/quizRoutes");
const progressRouter = require("./routes/progressRoutes");

const messageRouter = require("./routes/messageRoutes");

const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/users", userRouter);
app.use("/api/material", materialRouter);
// app.use("/api/lesson", lessonRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/message", messageRouter);
app.use("/api/progress", progressRouter);
app.options("*", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.send("ok");
});

connectDB(process.env.MONGO_URL);
// initModel();

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
