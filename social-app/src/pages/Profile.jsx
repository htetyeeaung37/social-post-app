import { 
    Box, Typography, Avatar, Card, CardContent, Divider, 
    Stack, Container, Grid, Paper, Skeleton
} from "@mui/material";
import { 
    Article as PostIcon, 
    Comment as CommentIcon,
    EmojiPeople as BioIcon
} from "@mui/icons-material";

import { useQuery } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Post from "../components/Post";

const api = `${import.meta.env.VITE_API_URL}/users/profile`;

export default function Profile() {
    const { auth } = useApp();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth) navigate("/login");
    }, [auth, navigate]);

    const {
        data: profile,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const token = localStorage.getItem("token");
            const res = await fetch(api, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
        },
        enabled: !!auth,
    });

    if (isLoading) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Skeleton variant="circular" width={100} height={100} sx={{ mx: "auto", mb: 2 }} />
                <Skeleton variant="text" width="60%" sx={{ mx: "auto", mb: 1 }} />
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2, mb: 4 }} />
            </Container>
        );
    }

    if (error || !auth) return null;

    return (
        <Container maxWidth="sm" sx={{ mt: 4, pb: 6 }}>
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Avatar
                    sx={{ 
                        width: 110, 
                        height: 110, 
                        mx: "auto",
                        mb: 2,
                        bgcolor: "primary.main",
                        fontSize: "3rem",
                        boxShadow: 3,
                        border: "4px solid white"
                    }}
                >
                    {profile.name[0].toUpperCase()}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {profile.name}
                </Typography>
                <Typography variant="body1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                    @{profile.username}
                </Typography>
                
                {profile.bio && (
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            maxWidth: "80%", 
                            mx: "auto", 
                            fontStyle: "italic",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1
                        }}
                    >
                        <BioIcon fontSize="small" /> {profile.bio}
                    </Typography>
                )}
            </Box>

            {/* Stats Section */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                        <PostIcon color="primary" sx={{ mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {profile._count.posts}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Posts</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: "center", borderRadius: 3 }}>
                        <CommentIcon color="secondary" sx={{ mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {profile._count.comments}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Comments</Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Divider sx={{ mb: 4 }}>
                <Typography variant="overline" color="text.secondary">Your Activity</Typography>
            </Divider>

            {/* Posts List */}
            <Stack spacing={3}>
                {profile.posts.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 6, opacity: 0.6 }}>
                        <PostIcon sx={{ fontSize: 60, mb: 1 }} />
                        <Typography>No posts yet. Start sharing!</Typography>
                    </Box>
                ) : (
                    profile.posts.map(post => (
                        <Post key={post.id} post={post} />
                    ))
                )}
            </Stack>
        </Container>
    );
}