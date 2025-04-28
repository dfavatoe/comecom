"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Button from "@mui/material/Button";
import ChatWindow from "@/components/ChatWindow";

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
        (room: any) =>
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
      // console.error("Chat could not be started", err);
    }
  };

  return (
    <>
      <div
        style={{ position: "fixed", bottom: "90px", right: "5%", zIndex: 1002 }}
      ></div>
      <Button
        variant="contained"
        onClick={startChat}
        color="warning"
        sx={{ mb: 3, fontWeight: "bold" }}
        style={{
          position: "fixed",
          right: "5%",
          bottom: "20px",
          zIndex: 1001,
        }}
      >
        {showChat ? "Close Chat" : "Contact Seller"}
      </Button>

      {showChat && chatroomId && (
        <>
          <div>
            <ChatWindow
              chatroomId={chatroomId}
              onClose={() => setShowChat(false)}
              refreshChatrooms={() => {}}
            />
          </div>
        </>
      )}
    </>
  );
}
