"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import "@/app/globals.css";

export default function SellerChatDashboard() {
  const { data: session } = useSession();
  const [chatrooms, setChatrooms] = useState<any[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [roomToDelete, setRoomToDelete] = useState<any>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchChatrooms = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/chatroom");
        const allRooms = await res.json();

        const myRooms = allRooms.filter((room: any) =>
          room.participants.some((user: any) => user._id === session.user.id)
        );

        setChatrooms(myRooms);
      } catch (err) {
        console.error("Error loading chatrooms:", err);
      }
    };

    fetchChatrooms();
  }, [session]);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    roomId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setRoomToDelete(roomId);
    console.log("roomToDelete set:", roomId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const deleteChatroom = async (chatroomId: string) => {
    const res = await fetch(`/api/chatroom/${chatroomId}`, {
      method: "DELETE",
    });
    return res.ok;
  };

  const handleDeleteClick = () => {
    console.log("roomToDelete inside handleDeleteClick:", roomToDelete);
    setConfirmOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    console.log("roomToDelete before delete:", roomToDelete);

    if (!roomToDelete) {
      console.error("No chatroom found to delete or invalid ID");
      return;
    }

    const res = await fetch(`/api/chatroom/${roomToDelete}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setChatrooms((prev) => prev.filter((room) => room._id !== roomToDelete));
      setConfirmOpen(false);
      setRoomToDelete(null);
    } else {
      alert("Error deleting chatroom");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <h2>Your Chatrooms</h2>

      {chatrooms.length === 0 ? (
        <Typography color="text.secondary">No chats found.</Typography>
      ) : (
        <Stack spacing={2}>
          {chatrooms.map((room) => {
            console.log("room :>> ", room);
            const otherParticipants = room.participants.filter(
              (user: any) => user._id !== session?.user?.id
            );

            const participantNames = otherParticipants
              .map((user: any) => user.name)
              .join(", ");

            const createdAt = room.created_at
              ? new Date(room.created_at).toLocaleDateString()
              : "Unknown";

            const time = new Date(room.created_at).toLocaleString([], {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <Paper
                key={room._id}
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Chat with {participantNames || "Unknown"}
                  </Typography>

                  <IconButton
                    aria-controls="chatroom-menu"
                    aria-haspopup="true"
                    onClick={(e) => handleMenuOpen(e, room._id)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Created: {createdAt}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Link
                  href={`/chat/${room._id}`}
                  // passHref
                  // legacyBehavior
                >
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ color: "var(--btn-blue)" }}
                  >
                    Open Chat
                  </Button>
                </Link>
              </Paper>
            );
          })}
        </Stack>
      )}
      <Menu
        id="chatroom-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ minWidth: "150px" }}
      >
        <MenuItem onClick={handleDeleteClick}>Delete Chat</MenuItem>
      </Menu>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete chat?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this chat? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
