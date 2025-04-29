import WebSocket, { RawData, WebSocketServer } from "ws";
import { characters } from "./characters_dashboard";
import { Character } from "./character.type";

const PORT = 8080;

const wws = new WebSocketServer({ port: PORT });

const pageSize = 4;
let currentPage = 1;

const randomizeData = (characters: Character[]): void => {
  const randomIndex: number = Math.floor(Math.random() * characters.length);
  const randomCharacter: Character = characters[randomIndex];

  randomCharacter.name = `${
    randomCharacter.name
  } - Updated ${Math.random().toFixed(3)}`;

  randomCharacter.fighting_style = `New Fighting Style ${Math.floor(
    Math.random() * 10
  )}`;

  randomCharacter.personality = `New Personality ${Math.random().toFixed(3)}`;

  console.log(`Character updated: ${randomCharacter.name}`);
};

setInterval(() => {
  randomizeData(characters);
}, 1000);

wws.on("connection", (ws: WebSocket) => {
  console.log(`New client info loaded ${ws}`);

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
