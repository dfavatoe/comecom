"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import ChatModal from "./ChatModal";
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

    if (!sellerId) {
      alert("Seller ID is missing");
      return;
    }
    // Falls Chat offen ist → einfach schließen
    if (showChat) {
      setShowChat(false);
      return;
    }

    try {
      // 🔍 1. Prüfe, ob Chatroom schon existiert
      const res = await fetch(`/api/chatroom`);
      const allChatrooms = await res.json();

      const existingChat = allChatrooms.find(
        (room: any) =>
          room.participants.includes(session.user.id) &&
          room.participants.includes(sellerId)
      );

      if (existingChat) {
        console.log("✅ Chatroom gefunden:", existingChat);
        setChatroomId(existingChat._id);
        setShowChat(true);
        return;
      }

      // 🆕 2. Sonst neuen Chatroom erstellen
      // const createRes = await fetch(`/api/chatroom`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     // otherUserId: sellerId,
      //     participants: [session.user.id, sellerId],
      //   }),
      // });
      const chatroomId = [session.user.id, sellerId].sort().join("_");

      const createRes = await fetch(`/api/chatroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatroomId,
        }),
      });

      // prüfen, ob nach dem fetchen, die antwort korrekt ist
      if (!createRes.ok) {
        const text = await createRes.text();
        console.error("❌ Fehler beim Erstellen des Chatrooms:", text);
        return;
      }

      const newChatroom = await createRes.json();
      console.log("💬 Neuer Chatroom erstellt / gefunden:", newChatroom);
      console.log(newChatroom);
      setChatroomId(newChatroom._id);
      setShowChat(true);
    } catch (err) {
      console.error("Chat konnte nicht gestartet werden", err);
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

      {/* {showChat && chatroomId && (
        <ChatModal chatroomId={chatroomId} onClose={() => setShowChat(false)} />
      )} */}
      {showChat && chatroomId && (
        <>
          {console.log(
            "📦 ChatWindow wird gerendert mit chatroomId:",
            chatroomId
          )}

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
              zIndex: 999,
              overflow: "hidden",
            }}
          >
            <ChatWindow chatroomId={chatroomId} />
          </div>
        </>
      )}
    </>
  );
}
