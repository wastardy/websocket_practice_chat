import express from "express";
import configure from "./routes";

const app = express();
const PORT = process.env.PORT || 3030;

configure(app);

console.log(`Attempting to start server on port ${PORT}`);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
