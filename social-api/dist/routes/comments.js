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
exports.router.delete("/:id", auth_1.auth, async (req, res) => {
    const id = req.params.id;
    const userId = res.locals.user.id;
    // First check if the comment exists and belongs to the user
    const comment = await prisma_1.prisma.comment.findFirst({
        where: { id: Number(id) },
    });
    if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
    }
    if (comment.userId !== userId) {
        return res.status(403).json({ msg: "You can only delete your own comments" });
    }
    // Delete the comment
    await prisma_1.prisma.comment.delete({
        where: { id: Number(id) },
    });
    res.json({ msg: "Comment deleted successfully" });
});
