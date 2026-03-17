// src/app.ts
import express from "express";
import cors from "cors";
import { router as usersRouter } from "../routes/users";
import { router as postsRouter } from "../routes/posts";
import { router as commentsRouter } from "../routes/comments";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);

app.get("/", (req, res) => {
  res.json({ msg: "API up and running..." });
});

export default app;