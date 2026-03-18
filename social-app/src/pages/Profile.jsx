import { 
	Box, 
	Typography, 
	Avatar, 
	Card, 
	CardContent,
	Divider,
	Chip,
	CircularProgress
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { 
	Person as PersonIcon,
	Article as PostIcon,
	Comment as CommentIcon 
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

	// Redirect to login if not authenticated
	useEffect(() => {
		if (!auth) {
			navigate("/login");
		}
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
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			
			if (!res.ok) {
				throw new Error("Failed to fetch profile");
			}
			
			return res.json();
		},
		enabled: !!auth, // Only run query if user is authenticated
	});

	if (!auth) {
		return null; // Will redirect to login
	}

	if (isLoading) {
		return (
			<Box sx={{ mt: 4, textAlign: "center" }}>
				<CircularProgress />
				<Typography sx={{ mt: 2 }}>Loading profile...</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ mt: 4, textAlign: "center" }}>
				<Typography color="error">{error.message}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ mt: 4 }}>
			{/* Profile Header */}
			<Card sx={{ mb: 3 }}>
				<CardContent>
					<Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 2 }}>
						<Avatar
							sx={{ 
								width: 80, 
								height: 80, 
								background: green[500],
								fontSize: "2rem"
							}}
						>
							{profile.name[0]}
						</Avatar>
						<Box sx={{ flexGrow: 1 }}>
							<Typography variant="h4" sx={{ mb: 1 }}>
								{profile.name}
							</Typography>
							<Typography variant="h6" sx={{ color: green[500], mb: 1 }}>
								@{profile.username}
							</Typography>
							{profile.bio && (
								<Typography sx={{ color: grey[600], mb: 2 }}>
									{profile.bio}
								</Typography>
							)}
						</Box>
					</Box>

					<Divider sx={{ my: 2 }} />

					{/* Stats */}
					<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
						<Chip
							icon={<PostIcon />}
							label={`${profile._count.posts} Posts`}
							variant="outlined"
							sx={{ color: green[600] }}
						/>
						<Chip
							icon={<CommentIcon />}
							label={`${profile._count.comments} Comments`}
							variant="outlined"
							sx={{ color: grey[600] }}
						/>
					</Box>
				</CardContent>
			</Card>

			{/* Posts Section */}
			<Typography variant="h5" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
				<PostIcon />
				Your Posts
			</Typography>

			{profile.posts.length === 0 ? (
				<Card sx={{ textAlign: "center", py: 4 }}>
					<CardContent>
						<PostIcon sx={{ fontSize: 48, color: grey[400], mb: 2 }} />
						<Typography variant="h6" sx={{ color: grey[500] }}>
							No posts yet
						</Typography>
						<Typography sx={{ color: grey[400] }}>
							Share your first post to get started!
						</Typography>
					</CardContent>
				</Card>
			) : (
				<Box>
					{profile.posts.map(post => (
						<Post key={post.id} post={post} />
					))}
				</Box>
			)}
		</Box>
	);
}
