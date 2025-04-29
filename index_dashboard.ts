import WebSocket, { RawData, WebSocketServer } from "ws";
import { characters } from "./characters_dashboard";

const PORT = 8080;

const wws = new WebSocketServer({ port: PORT });

const pageSize = 4;

wws.on("connection", (ws: WebSocket) => {
  console.log(`New client info loaded ${ws}`);

  let currentPage = 1;

  const sendPageContent = () => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageContent = characters.slice(start, end);

    ws.send(JSON.stringify({ page: currentPage, content: pageContent }));
  };

  sendPageContent();

  ws.on("message", (message: string) => {
    if (message === "next") {
      currentPage++;
      sendPageContent();
    } else if (message === "prev" && currentPage > 1) {
      currentPage--;
      sendPageContent();
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);
