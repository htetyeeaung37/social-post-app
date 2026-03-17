import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

import { router as usersRouter } from "./routes/users";
app.use("/users", usersRouter);

import { router as postsRouter } from "./routes/posts";
app.use("/posts", postsRouter);

import { router as commentsRouter } from "./routes/comments";
app.use("/comments", commentsRouter);

app.get("/", (req, res) => {
    res.json({ msg: "API up and running..." });
});

app.listen(8800, () => {
    console.log("API Running at 8800...");
});
