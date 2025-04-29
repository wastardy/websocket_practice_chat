import WebSocket, { WebSocketServer } from "ws";
import { characters } from "./characters_dashboard";
import { Character } from "./character.type";

const PORT = 8080;

const wws = new WebSocketServer({ port: PORT });

const pageSize = 4;

let clients: { ws: WebSocket; currentPage: number }[] = [];

const sendPageContent = (ws: WebSocket, page: number): void => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageContent = characters.slice(start, end);
  ws.send(JSON.stringify({ page, content: pageContent }));
};

wws.on("connection", (ws: WebSocket) => {
  console.log(`New client connected`);

  const client = { ws, currentPage: 1 };
  clients.push(client);

  sendPageContent(ws, client.currentPage);

  ws.on("message", (message: string) => {
    if (message === "next") {
      client.currentPage++;
      sendPageContent(ws, client.currentPage);
    } else if (message === "prev" && client.currentPage > 1) {
      client.currentPage--;
      sendPageContent(ws, client.currentPage);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client.ws !== ws);
  });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);
