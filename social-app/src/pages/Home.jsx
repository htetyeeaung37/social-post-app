import { Box, IconButton, OutlinedInput } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import Post from "../components/Post";
import { useApp } from "../AppProvider";

import { useQuery, useQueryClient } from "@tanstack/react-query";
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

	const addPost = async content => {
		const token = localStorage.getItem("token");
		const res = await fetch(api, {
			method: "POST",
			body: JSON.stringify({ content }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.ok) {
			queryClient.invalidateQueries(["posts"]);
		}
	};

	if (isLoading) {
		return <Box sx={{ mt: 4, textAlign: "center" }}>Loading...</Box>;
	}

	if (error) {
		return <Box sx={{ mt: 4, textAlign: "center" }}>{error.message}</Box>;
	}

	return (
		<Box sx={{ mt: 4 }}>
			{auth && (
				<Box sx={{ mb: 3 }}>
					<form
						onSubmit={e => {
							e.preventDefault();
							const content = inputRef.current.value;
							if (!content) return false;
							addPost(content);
							e.currentTarget.reset();
						}}>
						<OutlinedInput
							inputRef={inputRef}
							fullWidth
							placeholder="New post"
							endAdornment={
								<IconButton type="submit">
									<AddIcon />
								</IconButton>
							}
						/>
					</form>
				</Box>
			)}

			{posts.map(post => {
				return (
					<Post
						key={post.id}
						post={post}
					/>
				);
			})}
		</Box>
	);
}
