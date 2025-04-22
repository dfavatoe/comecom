"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Avatar,
} from "@mui/material";
import { useSession } from "next-auth/react";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "ai",
          text: "👋 Welcome to our shop! I'm your assistant. Ask me anything about our products.",
        },
      ]);
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { sender: "user", text: input },
    ];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          user: {
            id: session?.user?.id,
            name: session?.user?.name,
            email: session?.user?.email,
          },
        }),
      });

      const data = await res.json();
      setMessages([...newMessages, { sender: "ai", text: data.answer }]);
    } catch {
      setMessages([
        ...newMessages,
        { sender: "ai", text: " Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <IconButton
          onClick={() => setOpen(!open)}
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            color: "#1976d2",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontSize: 30,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.08)",
              backgroundColor: "#f0f0f0",
            },
          }}
        >
          🤖
        </IconButton>
      </Box>

      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 380,
            height: 500,
            bgcolor: "white",
            backgroundImage: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
            borderRadius: 4,
            boxShadow: 6,
            p: 2,
            display: "flex",
            flexDirection: "column",
            zIndex: 1200,
            backdropFilter: "blur(4px)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: "bold",
              color: "#1976d2",
              textAlign: "center",
            }}
          >
            🛍️ Com&Com AI Assistant
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 1,
            }}
          >
            {messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 1,
                }}
              >
                <Avatar
                  sx={{ width: 28, height: 28, bgcolor: "#1976d2" }}
                  src={
                    msg.sender === "user"
                      ? session?.user?.image ?? "/images/defaultProfile.jpg"
                      : undefined
                  }
                >
                  {msg.sender === "ai" ? "🤖" : ""}
                </Avatar>

                <Box>
                  {msg.sender === "user" && session?.user?.name && (
                    <Typography variant="caption" sx={{ color: "#888" }}>
                      {session.user.name}
                    </Typography>
                  )}
                  <Paper
                    sx={{
                      p: 1,
                      bgcolor: msg.sender === "user" ? "#1976d2" : "#ffffffcc",
                      color: msg.sender === "user" ? "white" : "black",
                      borderRadius: 2,
                      maxWidth: "80%",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {msg.text}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            ))}
            <div ref={chatEndRef} />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              value={input}
              placeholder="Type your question..."
              size="small"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button variant="contained" onClick={handleSend} disabled={loading}>
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Send"
              )}
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
