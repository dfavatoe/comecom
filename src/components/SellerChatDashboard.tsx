"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, Button, Divider } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import "@/app/globals.css";
import Chat from "./ChatWindow";
import { Chatroom, UserFull } from "@/model/types/types";

export default function SellerChatDashboard() {
  const { data: session } = useSession();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);

  //const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  //const [roomToDelete, setRoomToDelete] = useState<any>(null);

  //const [confirmOpen, setConfirmOpen] = useState(false);

  const [openChat, setOpenChat] = useState<string | null>(null);
  // const [chatroomId, setChatroomId] = useState<string | null>(null);

  const handleOpenChat = (id: string) => {
    //setChatroomId(id);
    setOpenChat(id);
  };

  const handleCloseChat = () => {
    setOpenChat(null);
  };

  const refreshChatrooms = (deletedRoomId: string) => {
    setChatrooms((prev) => prev.filter((room) => room._id !== deletedRoomId));
  };

  // const handleMenuOpen = (
  //   event: React.MouseEvent<HTMLButtonElement>,
  //   roomId: string
  // ) => {
  //   setAnchorEl(event.currentTarget);
  //   setRoomToDelete(roomId);
  //   console.log("roomToDelete set:", roomId);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  // };

  // const deleteChatroom = async (chatroomId: string) => {
  //   const res = await fetch(`/api/chatroom/${chatroomId}`, {
  //     method: "DELETE",
  //   });
  //   return res.ok;
  // };

  // const handleDeleteClick = () => {
  //   console.log("roomToDelete inside handleDeleteClick:", roomToDelete);
  //   setConfirmOpen(true);
  //   handleMenuClose();
  // };

  // const confirmDelete = async () => {
  //   console.log("roomToDelete before delete:", roomToDelete);

  //   if (!roomToDelete) {
  //     console.error("No chatroom found to delete or invalid ID");
  //     return;
  //   }

  //   const res = await fetch(`/api/chatroom/${roomToDelete}`, {
  //     method: "DELETE",
  //   });

  //   if (res.ok) {
  //     refreshChatrooms(roomToDelete);
  //     setConfirmOpen(false);
  //     setRoomToDelete(null);
  //   } else {
  //     alert("Error deleting chatroom");
  //   }
  // };

  useEffect(() => {
    const fetchChatrooms = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/chatroom");
        const allRooms = await res.json();

        const myRooms = allRooms.filter((room: Chatroom) =>
          room.participants.some(
            (user: UserFull) => user._id === session?.user!.id
          )
        );

        setChatrooms(myRooms);
      } catch (err) {
        console.error("Error loading chatrooms:", err);
      }
    };

    fetchChatrooms();
  }, [session]);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <h2>Your Chatrooms</h2>

      <Stack spacing={2}>
        {chatrooms.map((room) => {
          const otherParticipants = room.participants.filter(
            (user) => user._id !== session?.user?.id
          );
          const participantNames = otherParticipants
            .map((user) => user.name)
            .join(", ");
          const createdAt = room.created_at
            ? new Date(room.created_at).toLocaleDateString()
            : "Unknown";

          return (
            <Paper
              key={room._id}
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 2,
                transition: "all 0.2s",
                "&:hover": { boxShadow: 4 },
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

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleOpenChat(room._id)}
                >
                  Open Chat
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Created: {createdAt}
              </Typography>

              <Divider sx={{ my: 1 }} />
            </Paper>
          );
        })}
      </Stack>

      <Dialog
        open={!!openChat}
        onClose={handleCloseChat}
        fullWidth
        maxWidth="md"
      >
        <Box sx={{ position: "absolute", top: 8, right: 8 }}>
          <IconButton onClick={handleCloseChat}>
            <CloseIcon />
          </IconButton>
        </Box>

        {openChat && (
          <Chat
            chatroomId={openChat}
            onClose={handleCloseChat}
            refreshChatrooms={refreshChatrooms}
            variant="dashboard"
          />
        )}
      </Dialog>
    </Box>
  );
}
