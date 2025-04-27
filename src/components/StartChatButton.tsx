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
    // console.log("📨 startChat() triggered, sellerId:", sellerId);
    if (!session?.user?.id) {
      alert("Please login first");
      return;
    }
    console.log("Session User ID: ", session.user.id);
    console.log("Seller ID: ", sellerId);

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
      // 1. Check if the chatroom already exist
      const res = await fetch(`/api/chatroom`);
      const allChatrooms = await res.json();

      const existingChat = allChatrooms.find(
        (room: any) =>
          // room.participants.includes(session.user.id) &&
          room.participants.includes(buyerId) &&
          room.participants.includes(sellerId)
      );

      if (existingChat) {
        console.log("✅ Chatroom gefunden:", existingChat);
        setChatroomId(existingChat._id);
        setShowChat(true);
        return;
      }

      // 2. If not, create a new chatroom
      // const chatroomId = [session.user.id, sellerId].sort().join("_");
      const newChatroomId = [buyerId, sellerId].sort().join("_"); // Creating unique chatroom ID

      const createRes = await fetch(`/api/chatroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatroomId: newChatroomId,
          participants: [buyerId, sellerId],
          // participants: [session.user.id, sellerId],
        }),
      });

      // check, if answer is correct, after fetching
      if (!createRes.ok) {
        const text = await createRes.text();
        console.error("❌ Error creating the chatroom:", text);
        return;
      }

      const newChatroom = await createRes.json();
      console.log("💬 New chatroom created/ found:", newChatroom);
      console.log(newChatroom);
      setChatroomId(newChatroom._id);
      setShowChat(true);
    } catch (err) {
      console.error("Chat could not be started", err);
    }
  };

  return (
    <>
      {/* Debug-Ausgabe */}
      <div
        style={{ position: "fixed", bottom: "90px", right: "5%", zIndex: 1002 }}
      >
        {/*  INSERT FOR TESTING AGAIN, if you need it
        <p>showChat: {String(showChat)}</p>
        <p>chatroomId: {chatroomId}</p> */}
      </div>
      <Button
        variant="contained"
        onClick={startChat}
        color="warning"
        sx={{ mb: 3, fontWeight: "bold" }}
        style={{
          position: "fixed",
          right: "5%",
          bottom: "20px",
          zIndex: 1001, // 👆 Höher als Chatfenster, falls nötig
        }}
      >
        {showChat ? "Close Chat" : "Contact Seller"}
      </Button>

      {showChat && chatroomId && (
        <>
          {/* {console.log(
            "📦 ChatWindow wird gerendert mit chatroomId:",
            chatroomId
          )} */}

          <div
            style={{
              position: "fixed",
              bottom: "calc(30px + 56px)",
              right: "5%",
              width: "360px",
              height: "400px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
              overflow: "hidden",
            }}
          >
            <ChatWindow
              chatroomId={chatroomId}
              onClose={() => setShowChat(false)}
            />
          </div>
        </>
      )}
    </>
  );
}
