import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../libs/env";
import { prisma } from "../libs/prisma";
import { auth } from "../middlewares/auth";

export const router = express.Router();

router.get("/verify", auth, async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: res.locals.user.id as number,
    },
  });

  res.json(user);
});

router.get("/profile", auth, async (req, res) => {
  const userId = res.locals.user.id as number;

  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          user: true,
          comments: {
            include: { user: true },
          },
          likes: {
            include: { user: true },
          },
          _count: {
            select: { likes: true },
          },
        },
      },
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }

  res.json(user);
});

router.post("/", async (req, res) => {
  const name = req.body?.name;
  const username = req.body?.username;
  const bio = req.body?.bio;
  const password = req.body?.password;

  if (!name || !username || !password) {
    return res.status(400).json({ msg: "name, username or password missing" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, username, bio, password: hash },
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const username = req.body?.username;
  const password = req.body?.password;

  if (!username || !password) {
    return res.status(400).json({ msg: "username or password missing" });
  }

  const user = await prisma.user.findFirst({
    where: { username },
  });

  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, env.JWT_SECRET);

      return res.json({ user, token });
    }
  }

  res.status(401).json({ msg: "invalid username or password" });
});
