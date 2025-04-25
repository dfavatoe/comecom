"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
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

        const myRooms = allRooms.filter((room: any) =>
          room.participants.includes(session.user.id)
        );

        setChatrooms(myRooms);
      } catch (err) {
        console.error("Error loading chatrooms:", err);
      }
    };

    fetchChatrooms();
  }, [session]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Chatrooms</h2>
      {chatrooms.length === 0 && <p>No chats found.</p>}

      {chatrooms.map((room) => (
        <div
          key={room._id}
          style={{
            marginBottom: "1rem",
            borderBottom: "1px solid #ddd",
            paddingBottom: "1rem",
          }}
        >
          <p>
            <strong>Chat with:</strong> {session?.user?.name} <br />
            {/* <strong>Mit:</strong>{" "} */}
            {room.participants
              .filter((id: string) => id !== session?.user?.id)
              .join(", ")}
          </p>
          <Link href={`/chat/${room._id}`}>Open Chat</Link>
        </div>
      ))}
    </div>
  );
}
