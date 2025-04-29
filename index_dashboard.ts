import WebSocket, { WebSocketServer } from "ws";
import { characters } from "./characters_dashboard";

const PORT = 8080;

const wws = new WebSocketServer({ port: PORT });

const users = [
  { id: 1, name: "Jonathan Joestar" },
  { id: 2, name: "Dio Brando" },
  { id: 3, name: "Joseph Joestar" },
  { id: 4, name: "Jotaro Kujo" },
  { id: 5, name: "Kakyoin Noriaki" },
  { id: 6, name: "Polnareff Jean-Pierre" },
  { id: 7, name: "Avdol Muhammad" },
  { id: 8, name: "Rohan Kishibe" },
  { id: 9, name: "Giorno Giovanna" },
  { id: 10, name: "Bruno Bucciarati" },
];

wws.on("connection", (ws: WebSocket) => {
  console.log(`New client info loaded ${ws}`);

  let index = 0;
  const interval = setInterval(() => {
    if (index < characters?.length) {
      ws.send(JSON.stringify({ character: characters[index] }));
      index++;
    } else {
      clearInterval(interval);
    }
  }, 3000);

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server started on ws://localhost:${PORT}`);
