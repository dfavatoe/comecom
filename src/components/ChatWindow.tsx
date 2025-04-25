"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, ChangeEvent, FormEvent, useRef } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "@/model/types/types";
import "@/app/globals.css";

interface ChatProps {
  chatroomId: string;
}

export default function Chat({ chatroomId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const { data: session } = useSession();
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!chatroomId || chatroomId.length !== 24) return;

    // Initial laden
    fetchChat();

    // Polling starten
    const interval = setInterval(() => {
      fetchChat();
    }, 5000); // oder z. B. 3000ms für weniger Netzwerktraffic

    return () => clearInterval(interval);
  }, [chatroomId]);

  const fetchChat = async () => {
    const query = lastTimestamp ? `?after=${lastTimestamp}` : "";
    const res = await fetch(`/api/chatroom/${chatroomId}/message${query}`);
    const newMessages: Message[] = await res.json();

    if (newMessages.length > 0) {
      setMessages((prev) => {
        const existingIds = new Set(prev.map((msg) => msg._id));
        const allMessages = [...prev];

        newMessages.forEach((msg) => {
          if (!existingIds.has(msg._id)) {
            allMessages.push(msg);
          }
        });

        return allMessages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      const latest = newMessages.reduce((latest, msg) => {
        const time = new Date(msg.created_at).getTime();
        return time > latest ? time : latest;
      }, lastTimestamp ?? 0);

      setLastTimestamp(latest);
    }
  };

  const handleMessageTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      alert("You need to login first.");
      return;
    }

    const newMessage = {
      messageText,
      authorId: session.user.id,
      chatroomId,
    };

    const res = await fetch(`/api/chatroom/${chatroomId}/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });

    if (res.ok) {
      // Statt direkte Antwort → gesamte Chatliste neu laden
      await fetchChat();
      setMessageText("");
    } else {
      alert("Failed to send message");
    }
  };

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  // Get dynamically the Chatpartner-Name
  function getChatPartnerName(
    messages: Message[],
    currentUserId: string
  ): string {
    console.log("Messages:", messages);
    console.log("Current User ID:", currentUserId);

    if (messages.length === 0) {
      console.log("No messages found, returning Unknown User");
      return "Unknown User";
    }

    const partnerMsg = messages.find(
      (msg) => String(msg.authorId) !== String(currentUserId)
    );

    if (partnerMsg) {
      console.log("Partner found:", partnerMsg);
      return partnerMsg.authorName || "Unknown User";
    }

    console.log("No partner found, returning Unknown User");
    return "Unknown User";
  }

  // const chatPartnerName =
  //   messages.length > 0 ? session.user.name : "Unknown User";
  const chatPartnerName =
    messages.length > 0 && session?.user?.id
      ? getChatPartnerName(messages, session.user.id)
      : "Unknown User";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          padding: "0.5rem",
          backgroundColor: "var(--grey-bg)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Chat with {chatPartnerName}
        </Typography>
      </Box>
      {/* <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((message) => (
          <Typography key={message._id} variant="body2" sx={{ mb: 1 }}>
            {message.messageText}
          </Typography>
        ))}
      </div> */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((message) => {
          const isOwnMessage = String(message.authorId) === session?.user?.id;

          const time = new Date(message.created_at).toLocaleString([], {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Box
              key={message._id}
              sx={{
                display: "flex",
                justifyContent: isOwnMessage ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: isOwnMessage
                    ? "var(--secondary)"
                    : "var(--grey-bg)",
                  color: "black",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  maxWidth: "70%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", color: "gray" }}
                >
                  {isOwnMessage ? "You" : message.authorName || "User"}
                </Typography>
                <Typography variant="body2">{message.messageText}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.7rem",
                    float: "right",
                    marginTop: "4px",
                    color: "gray",
                  }}
                >
                  {time}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <Box
        component="form"
        onSubmit={handleMessageSubmit}
        sx={{
          display: "flex",
          p: 1,
          borderTop: "1px solid #eee",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message"
          onChange={handleMessageTextChange}
          value={messageText}
          //sx={{ height: "1em" }}
        />
        <Button type="submit">
          <SendIcon style={{ color: "var(--btn-blue)" }} />
        </Button>
      </Box>
    </div>
  );
}
