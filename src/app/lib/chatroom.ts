import ChatroomModel from "@/model/chatroomModel";
import dbConnect from "./dbConnect";

export async function createChatroom(userId: string, chatroomId: string) {
  try {
    // Stelle eine Verbindung zur Datenbank her
    await dbConnect();

    // TO DO - nochmal prüfen ob das relevant ist mit einem anderen ding als dem namen, denn den namen habe ich nicht.Überprüfen, ob der Chatroom mit diesem Namen bereits existiert
    //const existingChatroom = await ChatroomModel.findById(chatroomId);
    const existingChatroom = await ChatroomModel.findOne({ chatroomId });

    if (existingChatroom) {
      throw new Error("Chatroom with this ID already exists.");
    }

    // Erstelle einen neuen Chatroom
    const newChatroom = new ChatroomModel({
      // creatorId: userId, // Die ID des Benutzers, der den Chatroom erstellt
      chatroomId, // passt das hier?
      participants: [userId], // Den Ersteller als ersten Teilnehmer hinzufügen
      createdAt: new Date(),
    });

    // Speichern des neuen Chatrooms in der Datenbank
    await newChatroom.save();

    return newChatroom;
  } catch (error) {
    console.error("🔥 Fehler beim Erstellen des Chatrooms:", error);
    throw new Error(`Error creating chatroom: ${error.message}`);
  }
}
