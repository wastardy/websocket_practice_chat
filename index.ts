import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import configure from "./routes";
import { Socket } from "net";

const app = express();
const PORT = process.env.PORT || 3030;

// for http server error
function onWebsocketPreError(error: Error) {
  console.log(error);
}

// for websocket server error
function onWebsocketPostError(error: Error) {
  console.log(error);
}

configure(app);

console.log(`Attempting to start server on port ${PORT}`);

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// noServer = true is required to use the same
// server instance for both HTTP and WebSocket
const webSocketServer = new WebSocketServer({ noServer: true });

server.on("upgrade", (req: IncomingMessage, socket: Socket, head: Buffer) => {
  socket.on("error", onWebsocketPreError);
  const badAuth = req.headers["badauth"];

  // perform some type of auth
  if (typeof badAuth === "string") {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  webSocketServer.handleUpgrade(req, socket, head, (webSocket: WebSocket) => {
    socket.removeListener("error", onWebsocketPreError);
    webSocketServer.emit("connection", webSocket, req);
  });
});

webSocketServer.on("connection", (webSocket: WebSocket) => {
  webSocket.on("error", onWebsocketPostError);

  webSocket.on("message", (message: Buffer, isBinary: boolean) => {
    webSocketServer.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message, { binary: isBinary });
      }
    });
  });

  webSocket.on("close", () => {
    console.log("WebSocket connection closed");
  });
});
