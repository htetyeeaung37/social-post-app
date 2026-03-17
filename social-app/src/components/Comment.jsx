import { Avatar, Box, Typography, IconButton } from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Delete as DeleteIcon } from "@mui/icons-material";

import { useNavigate } from "react-router";
import { useApp } from "../AppProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function Comment({ comment, postId }) {
	const navigate = useNavigate();
	const { auth } = useApp();
	const queryClient = useQueryClient();

	const handleDelete = async () => {
		if (!confirm("Are you sure you want to delete this comment?")) {
			return;
		}

		const token = localStorage.getItem("token");
		const res = await fetch(`http://localhost:8800/comments/${comment.id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			// Invalidate the specific post query to refresh comments
			queryClient.invalidateQueries(["posts", postId]);
		} else {
			const error = await res.json();
			alert(error.msg || "Failed to delete comment");
		}
	};

	return (
		<Box
			sx={{
				mb: 2,
				p: 3,
				border: "1px solid #99999920",
			}}>
			<Box sx={{ display: "flex", gap: 2 }}>
				<Box>
					<Avatar
						sx={{ width: 48, height: 48, background: grey[500] }}>
						{comment.user.name[0]}
					</Avatar>
				</Box>
				<Box sx={{ flexGrow: 1 }}>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Box>
							<Typography>{comment.user.name}</Typography>
							<Typography sx={{ color: grey[500] }}>
								{comment.createdAt}
							</Typography>
						</Box>
						{auth && auth.id === comment.userId && (
							<IconButton 
								size="small" 
								onClick={handleDelete}
								sx={{ color: red[500] }}
							>
								<DeleteIcon />
							</IconButton>
						)}
					</Box>
					<Typography sx={{ mt: 1 }}>
						{comment.content}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
