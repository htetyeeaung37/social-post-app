import express from "express";
import jwt from "jsonwebtoken";

import { prisma } from "../libs/prisma";

export async function auth(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({ msg: "access token required" });
	}

	try {
		const data = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: number;
		};

		const user = await prisma.user.findFirst({
			where: { id: data.id },
		});

		res.locals.user = user;
		next();
	} catch (e) {
		res.status(500).json(e);
	}
}
