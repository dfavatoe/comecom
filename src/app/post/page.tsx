"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  TextField,
  Typography,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/useToast";
import "@/app/globals.css";

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
  } | null;
  text: string;
}

interface Post {
  _id: string;
  imageUrl: string;
  caption: string;
  user: {
    _id: string;
    name: string;
    image?: string;
    avatar?: string;
  };
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export default function PostPage() {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [menuAnchorMap, setMenuAnchorMap] = useState<
    Record<string, HTMLElement | null>
  >({});
  const [showForm, setShowForm] = useState(false);
  const { showToast } = useToast();

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const handleUpload = async () => {
    if (!file || !session?.user?.id) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("caption", caption);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      showToast(data.message || "Upload success!", "success");
      setCaption("");
      setFile(null);
      fetchPosts();
    } catch {
      showToast("Upload failed!", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
    });
    fetchPosts();
  };

  const handleDelete = async (postId: string) => {
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    fetchPosts();
  };

  const handleComment = async (postId: string) => {
    const text = commentMap[postId];
    if (!text) return;
    await fetch(`/api/posts/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setCommentMap((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts();
  };

  const handleCommentDelete = async (postId: string, commentId: string) => {
    const res = await fetch(`/api/posts/${postId}/comment/${commentId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (res.ok) {
      fetchPosts();
    } else {
      alert("Failed to delete comment: " + data.error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        variant="contained"
        fullWidth
        onClick={() => setShowForm(!showForm)}
        startIcon={<AddIcon />}
        color="warning"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Create Post
      </Button>

      <Collapse in={showForm}>
        <Card sx={{ mb: 3, p: 2 }}>
          <TextField
            type="file"
            inputProps={{ accept: "image/*" }}
            onChange={handleImageChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Caption"
            multiline
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            fullWidth
            color="warning"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="warning" /> : "Post"}
          </Button>
          {message && (
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Card>
      </Collapse>

      <Divider sx={{ mb: 4 }} />

      {posts.map((post) => (
        <Card key={post._id} sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
            <Avatar
              src={
                post.user?.avatar ||
                post.user?.image ||
                "/images/defaultProfile.jpg"
              }
            />
            <Typography variant="h6" sx={{ marginLeft: 2 }}>
              {post.user?.name || "Unknown"}
            </Typography>
            {session?.user?.id === post.user?._id && (
              <>
                <IconButton
                  onClick={(e) =>
                    setMenuAnchorMap((prev) => ({
                      ...prev,
                      [post._id]: e.currentTarget,
                    }))
                  }
                  sx={{ marginLeft: "auto" }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorMap[post._id]}
                  open={Boolean(menuAnchorMap[post._id])}
                  onClose={() =>
                    setMenuAnchorMap((prev) => ({ ...prev, [post._id]: null }))
                  }
                >
                  <MenuItem
                    onClick={() => {
                      handleDelete(post._id);
                      setMenuAnchorMap((prev) => ({
                        ...prev,
                        [post._id]: null,
                      }));
                    }}
                  >
                    Delete Post
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

          <CardMedia
            component="img"
            height="350"
            image={post.imageUrl}
            sx={{ borderRadius: 2, objectFit: "contain" }}
          />

          <CardContent>
            <Typography variant="body1" sx={{ marginTop: 1 }}>
              {post.caption}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                marginBottom: 1,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <IconButton
                  color={
                    post.likes.includes(session?.user?.id || "")
                      ? "error"
                      : "default"
                  }
                  onClick={() => handleLike(post._id)}
                >
                  <FavoriteIcon />
                </IconButton>
                <Typography variant="body2">{post.likes.length}</Typography>
              </Box>

              <IconButton
                disableRipple
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <ChatBubbleOutlineIcon sx={{ color: "gray" }} />
              </IconButton>
            </Box>

            <Box sx={{ display: "flex", gap: 1, marginTop: 2 }}>
              <TextField
                value={commentMap[post._id] || ""}
                onChange={(e) =>
                  setCommentMap((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                label="Add a comment"
                fullWidth
                size="small"
              />
              <Button
                variant="contained"
                onClick={() => handleComment(post._id)}
              >
                Comment
              </Button>
            </Box>

            <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

            <Box sx={{ maxHeight: 150, overflowY: "auto" }}>
              {post.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body2">
                    <b>{comment.user?.name || "Deleted User"}:</b>{" "}
                    {comment.text}
                  </Typography>

                  {String(comment.user?._id) === session?.user?.id && (
                    <IconButton
                      onClick={() => handleCommentDelete(post._id, comment._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>

            <Typography variant="caption" sx={{ marginTop: 2, color: "gray" }}>
              Posted on {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
