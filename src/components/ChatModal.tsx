"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Message, UserFull } from "@/model/types/types";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { useSession } from "next-auth/react";
import SendIcon from "@mui/icons-material/Send";

interface Props {
  chatroomId: string;
  onClose: () => void;
}

export default function ChatModal({ chatroomId, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState<string>("");
  const { data: session } = useSession(); // Authentifizierte Session holen
  const [users, setUsers] = useState<UserFull[]>([]);

  const fetchUser = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  console.log("users :>> ", users);

  //   const fetchMessages = async () => {
  //     const res = await fetch(`/api/chatroom/${chatroomId}/message`);
  //     const data = await res.json();
  //     setMessages(data);
  //   };

  // Hole alle Nachrichten für den Chatroom
  const fetchMessages = async () => {
    // Sicherheits-Check für gültige chatroomId
    if (!chatroomId || chatroomId.length !== 24) {
      console.error(
        "❌ Ungültige Chatroom-ID beim Abrufen der Nachrichten:",
        chatroomId
      );
      return;
    }

    try {
      const res = await fetch(`/api/chatroom/${chatroomId}/message`);

      if (!res.ok) {
        console.error("Error fetching messages", res.status);
        return;
      }

      const data = await res.json();

      // Überprüfen, ob 'data' ein Array ist, bevor wir es setzen
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Expected an array but got:", data);
      }
    } catch (error) {
      console.error("Error during fetching messages:", error);
    }
  };

  //   useEffect(() => {
  //     fetchMessages();
  //   }, [chatroomId]);

  // Nachrichten regelmäßig alle 5 Sekunden abrufen
  useEffect(() => {
    // Sicherheits-Check für gültige chatroomId
    if (!chatroomId || chatroomId.length !== 24) {
      console.error("❌ Ungültige Chatroom-ID:", chatroomId);
      return;
    }

    // Nachrichten abrufen
    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 1000000); // Alle 5 Sekunden - BEI WERT: 5000

    return () => clearInterval(interval); // Aufräumen des Intervalls bei Komponentendestruktion
  }, [chatroomId]);

  // Nachrichtenschreibfunktion
  const handleMessageTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  // Nachricht Absenden
  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      alert("You need to login first.");
      return;
    }

    const newMessage = {
      messageText: messageText, // Nachrichtentext
      authorId: session.user.id, // Authentifizierter Benutzer
      chatroomId: chatroomId, // Chatroom ID aus der URL
      date: new Date(),
    };

    // const res = await fetch(`/api/chatroom/${chatroomId}/message`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(newMessage),
    // });

    // if (res.ok) {
    //   const updatedMessages = await res.json();
    //   setMessages(updatedMessages); // Nachrichten aktualisieren
    //   setMessageText(""); // Textfeld leeren
    // } else {
    //   alert("Failed to send message");
    // }
    await fetch(`/api/chatroom/${chatroomId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    setMessageText(""); // Leere das Eingabefeld
    fetchMessages(); // Hol die neuesten Nachrichten
  };

  return (
    <div
      style={{
        position: "fixed",
        // top: "10%",
        // left: "50%",
        //transform: "translateX(-50%)",
        backgroundColor: "#fff",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
        width: "400px",
        zIndex: 9999,
        right: "5%",
        bottom: "8%",
        // height: "30rem",
      }}
    >
      <button onClick={onClose} style={{ float: "right", border: "none" }}>
        ❌
      </button>
      <h3>Chat</h3>
      <div style={{ overflowY: "auto", height: "30%" }}>
        {messages.map((message) => (
          <p key={message._id}>
            {/* {users.name} */}
            {/* <strong>{message.authorId}</strong>: {message.messageText} */}
          </p>
        ))}
        {messages.map((message) => {
          const user = users.find((user) => user._id === message.authorId); // Benutzer suchen
          return (
            <p key={message._id}>
              <strong>{user ? user.name : "Unknown User"}</strong>:{" "}
              {message.messageText}
            </p>
          );
        })}
      </div>
      {/* <Box
          component="form"
          onSubmit={handleMessageSubmit}
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          className="message-box"
        >
          <div>
            <TextField
              id="outlined-multiline-flexible"
              label="Your Text"
              multiline
              maxRows={6}
              variant="outlined"
              onChange={handleMessageTextChange}
              value={messageText}
            />
            <Button
              className="button message-button"
              type="submit"
              variant="outlined"
              size="small"
              style={{
                marginTop: "10px",
              }}
            >
              <SendIcon />
            </Button>
            
          </div>
        </Box> */}

      {/* TODO Hover - backgroundcolor change für Enter Icon */}
      <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Your Text</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          endAdornment={
            <InputAdornment position="end">
              {/* <SendIcon type="submit" /> */}
              <Button
                className="button message-button"
                type="submit"
                variant="outlined"
                size="small"
                style={{
                  marginTop: "10px",
                }}
              >
                <SendIcon />
              </Button>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      {/* PURE HTML FORM
      <form
        style={{
          display: "flex",
          flexGrow: "10px",
          border: "1px solid grey",
          padding: "1px",
        }}
      >
        <input
          type="text"
          placeholder="Your Text"
          style={{
            flexGrow: "10px",
            border: "none",
          }}
        />
        <button
          style={{
            border: "1px solid blue",
          }}
        >
          <SendIcon />
        </button>
      </form> */}
    </div>
  );
}
