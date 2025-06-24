"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import { Box, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { ChatroomAsString } from "@/model/types/types";

interface Props {
  sellerId: string;
}

export default function StartChatButton({ sellerId }: Props) {
  const { data: session } = useSession();
  const [chatroomId, setChatroomId] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const startChat = async () => {
    if (!session?.user?.id) {
      alert("Please login first");
      return;
    }
    // console.log("Session User ID: ", session.user.id);
    // console.log("Seller ID: ", sellerId);

    const buyerId = session.user.id;

    if (!sellerId) {
      alert("Seller ID is missing");
      return;
    }

    if (showChat) {
      setShowChat(false);
      return;
    }

    try {
      const res = await fetch(`/api/chatroom`);
      const allChatrooms = await res.json();

      const existingChat = allChatrooms.find(
        (room: ChatroomAsString) =>
          room.participants.includes(buyerId) &&
          room.participants.includes(sellerId)
      );

      if (existingChat) {
        // console.log("✅ Chatroom gefunden:", existingChat);
        setChatroomId(existingChat._id);
        setShowChat(true);
        return;
      }

      const newChatroomId = [buyerId, sellerId].sort().join("_");

      const createRes = await fetch(`/api/chatroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatroomId: newChatroomId,
          participants: [buyerId, sellerId],
        }),
      });

      if (!createRes.ok) {
        const text = await createRes.text();
        console.error("❌ Error creating the chatroom:", text);
        return;
      }

      const newChatroom = await createRes.json();
      // console.log("💬 New chatroom created/ found:", newChatroom);
      // console.log(newChatroom);
      setChatroomId(newChatroom._id);
      setShowChat(true);
    } catch (err) {
      console.error("Chat could not be started", err);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: "100px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          // "@media (max-width: 490px)": {
          //   // right: "calc(100% - 275px - 20px)",
          //   right: "calc(100% - 16rem - 20px)",
          //   gap: 2,
          // },
        }}
      >
        <IconButton
          // onClick={() => setOpen(!open)}
          onClick={startChat}
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "var(--btn-yellow)",
            color: "#000",
            fontSize: 30,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            "&:hover": {
              transform: "scale(1.08)",
              backgroundColor: "#e6b800",
            },
          }}
        >
          <ChatIcon />
        </IconButton>
      </Box>

      {showChat && chatroomId && (
        <>
          <div>
            <ChatWindow
              chatroomId={chatroomId}
              onClose={() => setShowChat(false)}
              refreshChatrooms={() => {}}
              variant="store"
            />
          </div>
        </>
      )}
    </>
  );
}
