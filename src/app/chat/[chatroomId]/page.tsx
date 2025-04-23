"use client";

import ChatWindow from "@/components/ChatWindow";
import { useParams } from "next/navigation";

export default function ChatRoomPage() {
  const params = useParams();
  const chatroomId = params?.chatroomId as string;

  if (!chatroomId) {
    return <div> No chat found. </div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>💬 Chatroom</h2>
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          height: "600px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        }}
      >
        <ChatWindow chatroomId={chatroomId} />
      </div>
    </div>
  );
}
