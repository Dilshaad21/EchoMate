import ws, { WebSocketServer } from "ws";
import { ApiError } from "./utils/ApiError.js";
import jwt from "jsonwebtoken";
import { Message } from "./models/message.model.js";

export default function webSocketServer(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (connection, req) => {
    const cookie = req.headers.cookie;
    if (!cookie) throw new ApiError(401, "User not authorized");

    const accessToken = cookie.split(";")[0]?.replace("accessToken=", "");

    if (!accessToken) throw new ApiError(401, "Access token not found");

    try {
      // Check the json token, embed it to connection and send online users.
      const { username, id } = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      connection.username = username;
      connection.id = id;

      [...wss.clients].forEach((client) => {
        client.send(
          JSON.stringify({
            online: [...wss.clients].map((client) => ({
              username: client.username,
              id: client.id,
            })),
          })
        );
      });

      // check incoming messages.
      connection.on("message", async (message) => {
        message = JSON.parse(message.toString())["message"];
        const recipientId = message["recipientId"];
        const text = message["text"];
        const messageObject = await Message.create({
          sender: connection.id,
          receiver: recipientId,
          text,
        });

        if (recipientId && text) {
          [...wss.clients]
            .filter(({ id }) => id === recipientId)
            .forEach((c) => {
              c.send(
                JSON.stringify({
                  message: {
                    text,
                    messageId: messageObject._id,
                    sender: messageObject.sender,
                    receiver: messageObject.receiver,
                  },
                })
              );
            });
        }
      });
    } catch (error) {
      throw new ApiError(400, "Something went wrong", [error]);
    }
  });
}
