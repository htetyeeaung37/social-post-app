"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../libs/prisma");
const auth_1 = require("../middlewares/auth");
exports.router = express_1.default.Router();
exports.router.get("/", async (req, res) => {
    const posts = await prisma_1.prisma.post.findMany({
        orderBy: { id: "desc" },
        include: {
            user: true,
            comments: true,
            likes: {
                include: { user: true }
            },
            _count: {
                select: { likes: true }
            }
        },
        take: 20,
    });
    res.json(posts);
});
exports.router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const post = await prisma_1.prisma.post.findFirst({
        where: { id: Number(id) },
        include: {
            user: true,
            comments: {
                include: { user: true },
            },
            likes: {
                include: { user: true }
            },
            _count: {
                select: { likes: true }
            }
        },
    });
    res.json(post);
});
exports.router.post("/", auth_1.auth, async (req, res) => {
    const content = req.body?.content;
    if (!content) {
        return res.status(400).json({ msg: "content is required" });
    }
    const post = await prisma_1.prisma.post.create({
        data: {
            content,
            userId: res.locals.user.id,
        },
    });
    res.status(201).json(post);
});
exports.router.delete("/:id", auth_1.auth, async (req, res) => {
    const id = req.params.id;
    const userId = res.locals.user.id;
    // First check if the post exists and belongs to the user
    const post = await prisma_1.prisma.post.findFirst({
        where: { id: Number(id) },
    });
    if (!post) {
        return res.status(404).json({ msg: "Post not found" });
    }
    if (post.userId !== userId) {
        return res.status(403).json({ msg: "You can only delete your own posts" });
    }
    // Delete the post (comments will be deleted due to cascade)
    await prisma_1.prisma.post.delete({
        where: { id: Number(id) },
    });
    res.json({ msg: "Post deleted successfully" });
});
exports.router.post("/:id/comments", auth_1.auth, async (req, res) => {
    const postId = req.params.id;
    const content = req.body?.content;
    const userId = res.locals.user.id;
    if (!content) {
        return res.status(400).json({ msg: "content is required" });
    }
    // Check if the post exists
    const post = await prisma_1.prisma.post.findFirst({
        where: { id: Number(postId) },
    });
    if (!post) {
        return res.status(404).json({ msg: "Post not found" });
    }
    const comment = await prisma_1.prisma.comment.create({
        data: {
            content,
            postId: Number(postId),
            userId,
        },
        include: {
            user: true,
        },
    });
    res.status(201).json(comment);
});
exports.router.post("/:id/like", auth_1.auth, async (req, res) => {
    const postId = req.params.id;
    const userId = res.locals.user.id;
    // Check if the post exists
    const post = await prisma_1.prisma.post.findFirst({
        where: { id: Number(postId) },
    });
    if (!post) {
        return res.status(404).json({ msg: "Post not found" });
    }
    // Check if user already liked this post
    const existingLike = await prisma_1.prisma.like.findFirst({
        where: {
            postId: Number(postId),
            userId: userId,
        },
    });
    if (existingLike) {
        return res.status(400).json({ msg: "Post already liked" });
    }
    // Create the like
    const like = await prisma_1.prisma.like.create({
        data: {
            postId: Number(postId),
            userId: userId,
        },
        include: {
            user: true,
        },
    });
    res.status(201).json(like);
});
exports.router.delete("/:id/like", auth_1.auth, async (req, res) => {
    const postId = req.params.id;
    const userId = res.locals.user.id;
    // Check if the like exists
    const existingLike = await prisma_1.prisma.like.findFirst({
        where: {
            postId: Number(postId),
            userId: userId,
        },
    });
    if (!existingLike) {
        return res.status(404).json({ msg: "Like not found" });
    }
    // Delete the like
    await prisma_1.prisma.like.delete({
        where: { id: existingLike.id },
    });
    res.json({ msg: "Post unliked successfully" });
});
