"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Message } from "@/model/types/types";

interface ChatProps {
  chatroomId: string;
}

export default function Chat({ chatroomId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const { data: session } = useSession();

  useEffect(() => {
    // Safety Check für gültige MongoDB-ID
    if (!chatroomId || chatroomId.length !== 24) {
      console.error("❌ Invalid chatroom ID:", chatroomId);
      return;
    }

    fetchChat();
  }, [chatroomId]);

  const fetchChat = async () => {
    const res = await fetch(`/api/chatroom/${chatroomId}/message`);
    const data = await res.json();
    setMessages(data.reverse());
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

    // if (res.ok) {
    //   const updatedMessages = await res.json();
    //   setMessages(updatedMessages);
    //   setMessageText("");
    // } else {
    //   alert("Failed to send message");
    // }
  };

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  // Get dynamically the Chatpartner-Name
  const chatPartnerName =
    messages.length > 0 ? session.user.name : "Unknown User";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          padding: "0.5rem",
          backgroundColor: "#f1f0f0",
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
          flexDirection: "column-reverse",
        }}
      >
        {messages.map((message) => {
          const isOwnMessage = message.authorId === session?.user?.id;
          // ONLY TIME
          //   const time = new Date(message.created_at).toLocaleTimeString([], {
          //     hour: "2-digit",
          //     minute: "2-digit",
          //   });
          // DATE AND TIME ARE SHOWN
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
                  backgroundColor: isOwnMessage ? "#ffefe2" : "#f1f0f0",
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
          <SendIcon />
        </Button>
      </Box>
    </div>
  );
}
