import express from "express";
import { prisma } from "../libs/prisma";
import { auth } from "../middlewares/auth";

export const router = express.Router();

router.delete("/:id", auth, async (req, res) => {
	const id = req.params.id;
	const userId = res.locals.user.id as number;

	// First check if the comment exists and belongs to the user
	const comment = await prisma.comment.findFirst({
		where: { id: Number(id) },
	});

	if (!comment) {
		return res.status(404).json({ msg: "Comment not found" });
	}

	if (comment.userId !== userId) {
		return res.status(403).json({ msg: "You can only delete your own comments" });
	}

	// Delete the comment
	await prisma.comment.delete({
		where: { id: Number(id) },
	});

	res.json({ msg: "Comment deleted successfully" });
});