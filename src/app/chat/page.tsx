import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import SendIcon from "@mui/icons-material/Send";
import { auth } from "@/app/lib/auth";
import { Message, Chat, UserFull } from "@/model/types/types";

export default async function Chat() {
  const session = await auth();
  if (!session?.user) return null;
  console.log("name: ", session.user.name);

  //   const [messages, setMessages] = useState<MessageType[] | null >(null)
  //   const [messageText, setMessageText] = useState<string>("");
  return (
    <div>
      <h2> Welcome to the Chat, {session.user.name}</h2>
      {/* {session.user.id} */}

      {/* <Stack gap={1} className="align-items-center">
        <Card className="chat-card">
          {messages &&
            messages.map((message) => {
              let messageClass = "";
              if (message.author === user?.email) {
                messageClass = "my-message"; // Wenn die Nachricht vom Benutzer stammt
              } else {
                messageClass = "other-message"; // Wenn die Nachricht von jemand anderem stammt
              }
              return (
                <Card
                  className={`card ${messageClass}`}
                  sx={{ maxWidth: 345, background: "transparent" }}
                  key={message.id}
                >
                  <CardContent>
                    {/* Email */}
      {/* <Typography gutterBottom variant="h6" component="div">
                      {message.author}
                    </Typography> */}
      {/* Datum */}
      {/* <Typography gutterBottom variant="body2" component="div">
                      {formatDate(message.date.seconds)}
                    </Typography> */}
      {/* Message */}
      {/* <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {message.text}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })} */}

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
                // className="text-field"
                id="outlined-multiline-flexible"
                label="Your Text"
                multiline
                maxRows={6}
                variant="outlined"
                onChange={handleMessageTextChange}
                value={messageText}
              />
            </div>
            <Button
              className="button message-button"
              type="submit"
              variant="outlined"
            >
              <SendIcon />
              {/* Send */}
      {/* </Button>
          </Box>
        </Card>
      </Stack> */}
    </div>
  );
}
