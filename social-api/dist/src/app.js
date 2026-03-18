"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = require("../routes/users");
const posts_1 = require("../routes/posts");
const comments_1 = require("../routes/comments");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/users", users_1.router);
app.use("/posts", posts_1.router);
app.use("/comments", comments_1.router);
app.get("/", (req, res) => {
    res.json({ msg: "API up and running..." });
});
exports.default = app;
