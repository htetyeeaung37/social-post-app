import express from "express";
import { prisma } from "../libs/prisma";

import { auth } from "../middlewares/auth";

export const router = express.Router();

router.get("/", async (req, res) => {
	const posts = await prisma.post.findMany({
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

router.get("/:id", async (req, res) => {
	const id = req.params.id;
	const post = await prisma.post.findFirst({
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

router.post("/", auth, async (req, res) => {
	const content = req.body?.content;
	if (!content) {
		return res.status(400).json({ msg: "content is required" });
	}

	const post = await prisma.post.create({
		data: {
			content,
			userId: res.locals.user.id as number,
		},
	});

	res.status(201).json(post);
});

router.delete("/:id", auth, async (req, res) => {
	const id = req.params.id;
	const userId = res.locals.user.id as number;

	// First check if the post exists and belongs to the user
	const post = await prisma.post.findFirst({
		where: { id: Number(id) },
	});

	if (!post) {
		return res.status(404).json({ msg: "Post not found" });
	}

	if (post.userId !== userId) {
		return res.status(403).json({ msg: "You can only delete your own posts" });
	}

	// Delete the post (comments will be deleted due to cascade)
	await prisma.post.delete({
		where: { id: Number(id) },
	});

	res.json({ msg: "Post deleted successfully" });
});

router.post("/:id/comments", auth, async (req, res) => {
	const postId = req.params.id;
	const content = req.body?.content;
	const userId = res.locals.user.id as number;

	if (!content) {
		return res.status(400).json({ msg: "content is required" });
	}

	// Check if the post exists
	const post = await prisma.post.findFirst({
		where: { id: Number(postId) },
	});

	if (!post) {
		return res.status(404).json({ msg: "Post not found" });
	}

	const comment = await prisma.comment.create({
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

router.post("/:id/like", auth, async (req, res) => {
	const postId = req.params.id;
	const userId = res.locals.user.id as number;

	// Check if the post exists
	const post = await prisma.post.findFirst({
		where: { id: Number(postId) },
	});

	if (!post) {
		return res.status(404).json({ msg: "Post not found" });
	}

	// Check if user already liked this post
	const existingLike = await prisma.like.findFirst({
		where: {
			postId: Number(postId),
			userId: userId,
		},
	});

	if (existingLike) {
		return res.status(400).json({ msg: "Post already liked" });
	}

	// Create the like
	const like = await prisma.like.create({
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

router.delete("/:id/like", auth, async (req, res) => {
	const postId = req.params.id;
	const userId = res.locals.user.id as number;

	// Check if the like exists
	const existingLike = await prisma.like.findFirst({
		where: {
			postId: Number(postId),
			userId: userId,
		},
	});

	if (!existingLike) {
		return res.status(404).json({ msg: "Like not found" });
	}

	// Delete the like
	await prisma.like.delete({
		where: { id: existingLike.id },
	});

	res.json({ msg: "Post unliked successfully" });
});
