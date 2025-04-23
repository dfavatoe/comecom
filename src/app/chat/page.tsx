"use client"; // Diese Direktive stellt sicher, dass die Datei als Client-Komponente behandelt wird.

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import StartChatButton from "@/components/StartChatButton";

export default function Chat() {
  // const [messageText, setMessageText] = useState<string>("");
  const dummySellerId = "6616aa551b0bca7f42123456"; // Später dynamisch holen TODO

  const [messages, setMessages] = useState<any[]>([]); // Zustand für Nachrichten
  const { data: session } = useSession(); // Authentifizierte Session holen
  const [chatroomId, setChatroomId] = useState<string | null>(null); // Zustand für die chatroomId

  // const [isChatOpen, setIsChatOpen] = useState(false);

  // const toggleChat = () => {
  //   setIsChatOpen((prev) => !prev);
  // };

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
