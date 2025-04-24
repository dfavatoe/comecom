"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StartChatButton from "@/components/StartChatButton";
import Link from "next/link";

export default function Chat() {
  const dummySellerId = "6616aa551b0bca7f42123456";

  const [messages, setMessages] = useState<any[]>([]);
  const { data: session } = useSession();
  const [chatroomId, setChatroomId] = useState<string | null>(null);

  useEffect(() => {
    if (chatroomId) {
      fetchChat();
    }
  }, [chatroomId]);

  const fetchChat = async () => {
    if (chatroomId) {
      const res = await fetch(`/api/chatroom/${chatroomId}/message`);
      const data = await res.json();
      setMessages(data);
    }
  };

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h2>Welcome to the Page of the Seller</h2>

      <Link className="mb-2" href={`/dashboard/chats`}>
        Your Chats
      </Link>
      <div style={{ padding: "2rem" }}>
        <StartChatButton sellerId={dummySellerId} />
      </div>
    </div>
  );
}
