import {
	Avatar,
	Box,
	Button,
	ButtonGroup,
	Card,
	IconButton,
	Typography,
} from "@mui/material";

import { green, grey, red } from "@mui/material/colors";

import {
	FavoriteBorderOutlined as LikeIcon,
	Favorite as LikedIcon,
	ChatBubbleOutline as CommentIcon,
	Delete as DeleteIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function Post({ post, onDelete }) {
	const navigate = useNavigate();
	const { auth } = useApp();
	const queryClient = useQueryClient();

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this post?")) {
			return;
		}

		const token = localStorage.getItem("token");
		const res = await fetch(`http://localhost:8800/posts/${post.id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			// Invalidate queries to refresh the posts list
			queryClient.invalidateQueries(["posts"]);
			// Call onDelete callback if provided (for single post view)
			if (onDelete) {
				onDelete();
			}
		} else {
			const error = await res.json();
			alert(error.msg || "Failed to delete post");
		}
	};

	// Check if current user has liked this post
	const isLiked = auth && post.likes?.some(like => like.userId === auth.id);
	const likeCount = post._count?.likes || post.likes?.length || 0;

	const handleLike = async () => {
		if (!auth) {
			alert("Please login to like posts");
			return;
		}

		const token = localStorage.getItem("token");
		const method = isLiked ? "DELETE" : "POST";
		
		const res = await fetch(`http://localhost:8800/posts/${post.id}/like`, {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			// Invalidate queries to refresh the posts
			queryClient.invalidateQueries(["posts"]);
			if (onDelete) { // This means we're in single post view
				queryClient.invalidateQueries(["posts", post.id.toString()]);
			}
		} else {
			const error = await res.json();
			alert(error.msg || "Failed to update like");
		}
	};

	return (
		<Card sx={{ mb: 2, p: 3 }}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar
						sx={{ width: 52, height: 52, background: green[500] }}>
						{post.user.name[0]}
					</Avatar>
				</Box>
				<Box sx={{ flexGrow: 1 }}>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Box>
							<Typography>{post.user.name}</Typography>
							<Typography sx={{ color: green[500] }}>
								{post.createdAt}
							</Typography>
						</Box>
						{auth && auth.id === post.userId && (
							<IconButton 
								size="small" 
								onClick={handleDelete}
								sx={{ color: red[500] }}
							>
								<DeleteIcon />
							</IconButton>
						)}
					</Box>
					<Typography 
						onClick={() => navigate(`/view/${post.id}`)}
						sx={{ cursor: "pointer", mt: 1 }}
					>
						{post.content}
					</Typography>
				</Box>
			</Box>
			<Box
				sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
				<ButtonGroup>
					<IconButton 
						size="sm" 
						onClick={handleLike}
						disabled={!auth}
					>
						{isLiked ? (
							<LikedIcon sx={{ color: red[500] }} />
						) : (
							<LikeIcon sx={{ color: auth ? red[500] : grey[400] }} />
						)}
					</IconButton>
					<Button
						size="sm"
						variant="text"
						sx={{ color: isLiked ? red[500] : "inherit" }}
					>
						{likeCount}
					</Button>
				</ButtonGroup>
				<ButtonGroup>
					<IconButton size="sm">
						<CommentIcon sx={{ color: grey[500] }} />
					</IconButton>
					<Button
						size="sm"
						variant="text">
						{post.comments.length}
					</Button>
				</ButtonGroup>
			</Box>
		</Card>
	);
}
