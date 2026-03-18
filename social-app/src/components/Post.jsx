import {
    Avatar,
    Box,
    Button,
    Card,
    IconButton,
    Typography,
    Stack,
    Divider,
    Tooltip
} from "@mui/material";

import { green, grey, red, blue } from "@mui/material/colors";

import {
    FavoriteBorderOutlined as LikeIcon,
    Favorite as LikedIcon,
    ChatBubbleOutline as CommentIcon,
    DeleteOutline as DeleteIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function Post({ post, onDelete }) {
    const navigate = useNavigate();
    const { auth } = useApp();
    const queryClient = useQueryClient();

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete post");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            if (onDelete) onDelete();
        },
        onError: (err) => alert(err.message)
    });

    // Like Mutation
    const likeMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem("token");
            const method = isLiked ? "DELETE" : "POST";
            const res = await fetch(`${import.meta.env.VITE_API_URL}/posts/${post.id}/like`, {
                method,
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to update like");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            if (onDelete) {
                queryClient.invalidateQueries(["posts", post.id.toString()]);
            }
        }
    });

    const isLiked = auth && post.likes?.some(like => like.userId === auth.id);
    const likeCount = post._count?.likes || post.likes?.length || 0;

    return (
        <Card elevation={0} sx={{ 
            mb: 2, 
            p: 2.5, 
            borderRadius: 3, 
            border: "1px solid",
            borderColor: "divider",
            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.05)" },
            transition: "box-shadow 0.2s"
        }}>
            <Box sx={{ display: "flex", gap: 2 }}>
                <Avatar
                    sx={{ 
                        width: 48, 
                        height: 48, 
                        bgcolor: "primary.main",
                        cursor: "pointer" 
                    }}
                    onClick={() => navigate(`/profile/${post.userId}`)}
                >
                    {post.user.name[0].toUpperCase()}
                </Avatar>
                
                <Box sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                                {post.user.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                {post.createdAt}
                            </Typography>
                        </Box>
                        
                        {auth && auth.id === post.userId && (
                            <IconButton 
                                size="small" 
                                onClick={() => {
                                    if(window.confirm("Delete this post?")) deleteMutation.mutate();
                                }}
                                disabled={deleteMutation.isPending}
                                sx={{ color: grey[400], "&:hover": { color: red[500] } }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Stack>

                    <Typography 
                        variant="body1"
                        onClick={() => navigate(`/view/${post.id}`)}
                        sx={{ 
                            cursor: "pointer", 
                            mt: 1.5, 
                            mb: 2,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word"
                        }}
                    >
                        {post.content}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ opacity: 0.6 }} />

            <Stack direction="row" spacing={1} sx={{ mt: 1, justifyContent: "space-around" }}>
                <Button 
                    startIcon={isLiked ? <LikedIcon sx={{ color: red[500] }} /> : <LikeIcon />}
                    onClick={() => auth ? likeMutation.mutate() : alert("Please login")}
                    sx={{ 
                        color: isLiked ? red[500] : "text.secondary",
                        textTransform: "none",
                        fontWeight: isLiked ? "bold" : "normal",
                        flex: 1,
                        borderRadius: 2
                    }}
                >
                    {likeCount > 0 ? likeCount : "Like"}
                </Button>

                <Button 
                    startIcon={<CommentIcon />}
                    onClick={() => navigate(`/view/${post.id}`)}
                    sx={{ 
                        color: "text.secondary",
                        textTransform: "none",
                        flex: 1,
                        borderRadius: 2
                    }}
                >
                    {post.comments?.length > 0 ? post.comments.length : "Comment"}
                </Button>
            </Stack>
        </Card>
    );
}