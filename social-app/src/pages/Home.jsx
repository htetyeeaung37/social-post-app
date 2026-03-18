import { 
    Box, IconButton, OutlinedInput, Typography, Container, 
    Card, CardContent, Avatar, Divider, Skeleton, Stack 
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

import Post from "../components/Post";
import { useApp } from "../AppProvider";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRef } from "react";

const api = `${import.meta.env.VITE_API_URL}/posts`;

export default function Home() {
    const inputRef = useRef();
    const queryClient = useQueryClient();
    const { auth } = useApp();

    const {
        data: posts,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["posts"],
        queryFn: async () => {
            const res = await fetch(api);
            return res.json();
        },
    });

    const addPostMutation = useMutation({
        mutationFn: async (content) => {
            const token = localStorage.getItem("token");
            const res = await fetch(api, {
                method: "POST",
                body: JSON.stringify({ content }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["posts"]);
            if (inputRef.current) inputRef.current.value = "";
        },
    });

    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Stack spacing={2}>
                    <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                    <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Stack>
            </Container>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography color="error">Error: {error.message}</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 4, pb: 4 }}>
            {/* Post Creation Area */}
            {auth && (
                <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 2 }}>
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                                {auth.name[0].toUpperCase()}
                            </Avatar>
                            <Box 
                                component="form" 
                                sx={{ flexGrow: 1, display: "flex" }}
                                onSubmit={e => {
                                    e.preventDefault();
                                    const content = inputRef.current.value;
                                    if (!content.trim()) return;
                                    addPostMutation.mutate(content);
                                }}
                            >
                                <OutlinedInput
                                    inputRef={inputRef}
                                    fullWidth
                                    multiline
                                    placeholder={`What's on your mind, ${auth.name}?`}
                                    sx={{ 
                                        borderRadius: 4,
                                        bgcolor: "action.hover",
                                        "& fieldset": { border: "none" } 
                                    }}
                                    endAdornment={
                                        <IconButton 
                                            type="submit" 
                                            color="primary"
                                            disabled={addPostMutation.isPending}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    }
                                />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Recent Posts
            </Typography>

            {/* Post List */}
            <Stack spacing={3}>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))
                ) : (
                    <Typography sx={{ textAlign: "center", color: "text.secondary", mt: 4 }}>
                        No posts yet. Be the first to share something!
                    </Typography>
                )}
            </Stack>
        </Container>
    );
}