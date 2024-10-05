import ws from "ws";

export default function webSocketServer(server) {
  const wss = new ws.WebSocketServer({ server });

  wss.on("connection", (connection) => {
    console.log("Connected to WSS", connection);
  });
}
