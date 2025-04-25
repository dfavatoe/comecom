"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import "@/app/globals.css";
import { Box, Typography, Paper, Stack, Button, Divider } from "@mui/material";
import "@/app/globals.css";

export default function SellerChatDashboard() {
  const { data: session } = useSession();
  const [chatrooms, setChatrooms] = useState<any[]>([]);

  useEffect(() => {
    const fetchChatrooms = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch("/api/chatroom");
        const allRooms = await res.json();

        // const myRooms = allRooms.filter((room: any) =>
        //   room.participants.includes(session.user.id)
        // );
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

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Your Chatrooms
      </Typography>

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
                <Typography variant="subtitle1" fontWeight="bold">
                  Chat with {participantNames || "Unknown"}
                </Typography>

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
    </Box>
  );
}
