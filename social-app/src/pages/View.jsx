import { Box, Button, OutlinedInput } from "@mui/material";
import Post from "../components/Post";
import Comment from "../components/Comment";

import { useParams, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../AppProvider";
import { useRef } from "react";

const api = "http://localhost:8800/posts";

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
            return res.json();
        }
    });

    const addComment = async (content) => {
        const token = localStorage.getItem("token");
        const res = await fetch(`${api}/${id}/comments`, {
            method: "POST",
            body: JSON.stringify({ content }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            queryClient.invalidateQueries(["posts", id]);
        } else {
            const error = await res.json();
            alert(error.msg || "Failed to add comment");
        }
    };

    const handlePostDelete = () => {
        navigate("/");
    };

    if (isLoading) {
		return <Box sx={{ mt: 4, textAlign: "center" }}>Loading...</Box>;
	}

	if (error) {
		return <Box sx={{ mt: 4, textAlign: "center" }}>{error.message}</Box>;
	}

	return (
		<Box sx={{ mt: 4 }}>
			<Post post={post} onDelete={handlePostDelete} />

			{auth && (
				<form
					onSubmit={e => {
						e.preventDefault();
						const content = commentRef.current.value;
						if (!content) return false;
						addComment(content);
						e.currentTarget.reset();
					}}
				>
					<OutlinedInput 
						inputRef={commentRef}
						placeholder="your reply" 
						fullWidth 
						sx={{ mb: 2 }} 
					/>
					<Button variant="contained" color="secondary" fullWidth type="submit">
						Add Comment
					</Button>
				</form>
			)}

			<Box sx={{ mt: 4 }}>
				{post.comments.map(comment => {
                    return <Comment key={comment.id} comment={comment} postId={id} />
                })}
			</Box>
		</Box>
	);
}
