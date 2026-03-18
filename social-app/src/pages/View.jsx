import { 
    Box, Button, OutlinedInput, Typography, Container, 
    Divider, Stack, Skeleton, Paper, Avatar 
} from "@mui/material";
import { Reply as ReplyIcon } from "@mui/icons-material";

import Post from "../components/Post";
import Comment from "../components/Comment";

import { useParams, useNavigate } from "react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import { useRef } from "react";

const api = `${import.meta.env.VITE_API_URL}/posts`;

export default function View() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { auth } = useApp();
    const commentRef = useRef();

    const {
        data: post,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["posts", id],
        queryFn: async () => {
            const res = await fetch(`${api}/${id}`);
            if (!res.ok) throw new Error("Post not found");
            return res.json();
        }
    });

    const addCommentMutation = useMutation({
        mutationFn: async (content) => {
            const token = localStorage.getItem("token");
            const res = await fetch(`${api}/${id}/comments`, {
                method: "POST",
                body: JSON.stringify({ content }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || "Failed to add comment");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["posts", id]);
            if (commentRef.current) commentRef.current.value = "";
        },
        onError: (err) => {
            alert(err.message);
        }
    });

    const handlePostDelete = () => {
        navigate("/");
    };

    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="text" width="40%" sx={{ mb: 4 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
                <Typography color="error" variant="h6">{error.message}</Typography>
                <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>Back to Home</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, pb: 8 }}>
            {/* Original Post */}
            <Post post={post} onDelete={handlePostDelete} />

            <Divider sx={{ my: 4 }}>
                <Typography variant="overline" color="text.secondary">
                    Comments ({post.comments?.length || 0})
                </Typography>
            </Divider>

            {/* Comment Form */}
            {auth && (
                <Paper variant="outlined" sx={{ p: 2, mb: 4, borderRadius: 3, bgcolor: "action.hover" }}>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            const content = commentRef.current.value;
                            if (!content.trim()) return;
                            addCommentMutation.mutate(content);
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: "0.9rem" }}>
                                {auth.name[0].toUpperCase()}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <OutlinedInput 
                                    inputRef={commentRef}
                                    placeholder="Write a reply..." 
                                    fullWidth 
                                    multiline
                                    rows={2}
                                    sx={{ 
                                        mb: 1.5, 
                                        borderRadius: 2, 
                                        bgcolor: "background.paper",
                                        "& fieldset": { borderColor: "divider" }
                                    }} 
                                />
                                <Button 
                                    variant="contained" 
                                    color="secondary" 
                                    type="submit"
                                    size="small"
                                    startIcon={<ReplyIcon />}
                                    disabled={addCommentMutation.isPending}
                                    sx={{ borderRadius: 2, textTransform: "none" }}
                                >
                                    Reply
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Paper>
            )}

            {/* Comments List */}
            <Stack spacing={2}>
                {post.comments && post.comments.length > 0 ? (
                    post.comments.map(comment => (
                        <Comment key={comment.id} comment={comment} postId={id} />
                    ))
                ) : (
                    <Typography sx={{ textAlign: "center", color: "text.secondary", py: 4 }}>
                        No comments yet.
                    </Typography>
                )}
            </Stack>
        </Container>
    );
}