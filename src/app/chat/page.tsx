"use client"; // Diese Direktive stellt sicher, dass die Datei als Client-Komponente behandelt wird.

import { useSession } from "next-auth/react";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import StartChatButton from "@/components/StartChatButton";

export default function Chat() {
  const dummySellerId = "6616aa551b0bca7f42123456"; // Später dynamisch holen TODO
  const [messages, setMessages] = useState<any[]>([]); // Zustand für Nachrichten
  const [messageText, setMessageText] = useState<string>("");
  const { data: session } = useSession(); // Authentifizierte Session holen
  const [chatroomId, setChatroomId] = useState<string | null>(null); // Zustand für die chatroomId

  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);
  };

  // Stelle sicher, dass die chatroomId aus der URL extrahiert wird, wenn die Komponente gemountet wird
  // useEffect(() => {
  //   const path = window.location.pathname; // Hole den vollständigen URL-Pfad
  //   const parts = path.split("/"); // Teile den Pfad auf
  //   const chatroomIdFromUrl = parts[parts.length - 1]; // Die chatroomId sollte der letzte Teil des Pfads sein
  //   setChatroomId(chatroomIdFromUrl); // Setze die chatroomId im Zustand
  // }, []);

  // Lade die Nachrichten, wenn die chatroomId vorhanden ist
  useEffect(() => {
    if (chatroomId) {
      fetchChat();
    }
  }, [chatroomId]);

  const fetchChat = async () => {
    if (chatroomId) {
      const res = await fetch(`/api/chatroom/${chatroomId}/message`);
      const data = await res.json();
      setMessages(data); // Nachrichten setzen
    }
  };

  // Nachrichtenschreibfunktion
  const handleMessageTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  // Nachricht Absenden
  const handleMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Sicherheits-Check für gültige chatroomId
    if (!chatroomId || chatroomId.length !== 24) {
      console.error("❌ Ungültige Chatroom-ID:", chatroomId);
      return;
    }

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

    const res = await fetch(`/api/chatroom/${chatroomId}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    // if (res.ok) {
    //   const updatedMessages = await res.json();
    //   setMessages(updatedMessages); // Nachrichten aktualisieren
    //   setMessageText(""); // Textfeld leeren
    // } else {
    //   alert("Failed to send message");
    // }
    if (res.ok) {
      await fetchChat(); // Lade alle Nachrichten neu
      setMessageText(""); // Leere das Textfeld
    } else {
      alert("Failed to send message");
    }
  };

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  return (
    <div>
      <h2>Welcome to the Page of the Seller</h2>

      <div style={{ padding: "2rem" }}>
        {/* <StartChatButton onClick={toggleChat} sellerId={dummySellerId} /> */}
        {/* TODO - Dummy ID hast to be changed to real seller id  */}
        <StartChatButton sellerId={dummySellerId} />
      </div>
    </div>
  );
}
