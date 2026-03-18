"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../libs/env");
const prisma_1 = require("../libs/prisma");
const auth_1 = require("../middlewares/auth");
exports.router = express_1.default.Router();
exports.router.get("/verify", auth_1.auth, async (req, res) => {
    const user = await prisma_1.prisma.user.findFirst({
        where: {
            id: res.locals.user.id,
        },
    });
    res.json(user);
});
exports.router.get("/profile", auth_1.auth, async (req, res) => {
    const userId = res.locals.user.id;
    const user = await prisma_1.prisma.user.findFirst({
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
exports.router.post("/", async (req, res) => {
    const name = req.body?.name;
    const username = req.body?.username;
    const bio = req.body?.bio;
    const password = req.body?.password;
    if (!name || !username || !password) {
        return res.status(400).json({ msg: "name, username or password missing" });
    }
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.prisma.user.create({
        data: { name, username, bio, password: hash },
    });
    res.json(user);
});
exports.router.post("/login", async (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;
    if (!username || !password) {
        return res.status(400).json({ msg: "username or password missing" });
    }
    const user = await prisma_1.prisma.user.findFirst({
        where: { username },
    });
    if (user) {
        if (await bcryptjs_1.default.compare(password, user.password)) {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, env_1.env.JWT_SECRET);
            return res.json({ user, token });
        }
    }
    res.status(401).json({ msg: "invalid username or password" });
});
