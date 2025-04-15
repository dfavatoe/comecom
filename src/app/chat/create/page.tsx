// import { useState } from "react";

// const CreateChatPage = () => {
//   const [userId1, setUserId1] = useState("");
//   const [userId2, setUserId2] = useState("");
//   const [chat, setChat] = useState(null);

//   const createChat = async () => {
//     const response = await fetch("/api/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId1, userId2 }),
//     });

//     const data = await response.json();
//     if (data.chat) {
//       setChat(data.chat);
//     } else {
//       alert(data.message);
//     }
//   };

//   return (
//     <div>
//       <h1>Create Chat</h1>
//       <input
//         type="text"
//         placeholder="User 1 ID"
//         value={userId1}
//         onChange={(e) => setUserId1(e.target.value)}
//       />
//       <input
//         type="text"
//         placeholder="User 2 ID"
//         value={userId2}
//         onChange={(e) => setUserId2(e.target.value)}
//       />
//       <button onClick={createChat}>Create Chat</button>

//       {chat && (
//         <div>
//           <h2>Chat created</h2>
//           <p>Chat ID: {chat._id}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateChatPage;
