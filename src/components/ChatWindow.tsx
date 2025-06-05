"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, ChangeEvent, FormEvent, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Message } from "@/model/types/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "@/app/globals.css";
import styles from "./chatwindow.module.css";

interface ChatProps {
  chatroomId: string;
  onClose?: () => void;
  refreshChatrooms: (deletedRoomId: string) => void;
  variant: "dashboard" | "store";
}

export default function Chat({
  chatroomId,
  onClose,
  refreshChatrooms,
  variant,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const { data: session } = useSession();
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!chatroomId || chatroomId.length !== 24) return;

    fetchChat();

    const interval = setInterval(() => {
      fetchChat();
    }, 2000);

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
  ): string | undefined {
    // console.log("Messages:", messages);
    // console.log("Current User ID:", currentUserId);

    if (messages.length === 0) {
      // console.log("No messages found, returning Unknown User");
      return undefined;
    }

    const partnerMsg = messages.find(
      (msg) => String(msg.authorId) !== String(currentUserId)
    );

    if (partnerMsg) {
      // console.log("Partner found:", partnerMsg);
      return partnerMsg.authorName;
    }

    // console.log("No partner found, returning Unknown User");
    // return "Unknown User";
  }

  const chatPartnerName =
    messages.length > 0 && session?.user?.id
      ? getChatPartnerName(messages, session.user.id)
      : undefined;

  // Delete Chatroom
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setConfirmOpen(true);
    handleMenuClose();
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/chatroom/${chatroomId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setConfirmOpen(false);
        if (onClose) onClose();
        refreshChatrooms(chatroomId);
      } else {
        alert("Error deleting chatroom");
      }
    } catch (error) {
      console.error("Error deleting chatroom:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div
      // className={styles.chatContainer}
      className={`${styles.chatContainer} ${
        variant === "dashboard"
          ? styles.dashboardChatWindow
          : styles.storeChatWindow
      }`}
    >
      <Box className={styles.chatHeader}>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          Chat with {chatPartnerName ? chatPartnerName : "Seller"}
        </Typography>

        <IconButton
          aria-controls="chat-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          sx={{
            zIndex: 1,
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          id="chat-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          disableScrollLock={true}
          className={styles.menu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleDeleteClick}>Delete Chat</MenuItem>
        </Menu>
      </Box>
      <div className={styles.chatMessages}>
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
                className={styles.messageBox}
                sx={{
                  backgroundColor: isOwnMessage
                    ? "#fbedb7"
                    : // "var(--secondary)"
                      "var(--grey-bg)",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", color: "gray" }}
                >
                  {isOwnMessage ? "You" : message.authorName || "User"}
                </Typography>
                <Typography variant="body2">{message.messageText}</Typography>
                <Typography variant="caption" className={styles.messageTime}>
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
        className={styles.chatFooter}
      >
        <TextField
          fullWidth
          placeholder="Contact the seller ..."
          onChange={handleMessageTextChange}
          value={messageText}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            marginRight: "0.4rem",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "var(--btn-yellow)",
            color: "#000",
            "&:hover": {
              bgcolor: "#e6b800",
            },
          }}
        >
          {/* <SendIcon style={{ color: "var(--btn-blue)" }} /> */}Send
        </Button>

        <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Delete chat?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
}
