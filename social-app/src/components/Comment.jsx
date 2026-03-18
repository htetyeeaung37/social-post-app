import {
  Avatar,
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";
import { grey, red } from "@mui/material/colors";
import { Delete as DeleteIcon } from "@mui/icons-material";

import { useApp } from "../AppProvider";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

export default function Comment({ comment, postId }) {
  const { auth } = useApp();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/comments/${comment.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Failed to delete comment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts", postId]);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <Box sx={{ mb: 2, display: "flex", gap: 1.5 }}>
      {/* User Avatar */}
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: "0.9rem",
          bgcolor: grey[400],
          boxShadow: 1,
        }}
      >
        {comment.user.name[0].toUpperCase()}
      </Avatar>

      {/* Comment Bubble */}
      <Box sx={{ flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            px: 2,
            borderRadius: 3,
            bgcolor: "action.hover",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: "bold", fontSize: "0.85rem" }}
            >
              {comment.user.name}
            </Typography>

            {auth && auth.id === comment.userId && (
              <Tooltip title="Delete Comment">
                <IconButton
                  size="small"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  sx={{
                    color: grey[400],
                    "&:hover": { color: red[500] },
                    p: 0,
                    ml: 1,
                  }}
                >
                  <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: "text.primary", lineHeight: 1.4 }}
          >
            {comment.content}
          </Typography>
        </Paper>

        {/* Date/Time info under the bubble */}
        <Typography
          variant="caption"
          sx={{
            ml: 1.5,
            mt: 0.5,
            display: "block",
            color: "text.secondary",
            fontSize: "0.7rem",
          }}
        >
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </Typography>
      </Box>
    </Box>
  );
}
