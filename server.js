import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";

const app = express();
const server = createServer(app);

const io = new Server(server);
const actions = JSON.parse(fs.readFileSync("./src/Actions.json", "utf8"));
console.log(`fetching from json file`);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  console.log(actions);

  socket.on(actions.JOIN, ({ roomId, username }) => {
    console.log("Joining room", roomId);
    socket.join(roomId);
    socket.to(roomId).emit(actions.USER_JOINED, username);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
