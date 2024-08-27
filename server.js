import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import fs from "fs";

const app = express();
const server = createServer(app);

const io = new Server(server);
const actions = JSON.parse(fs.readFileSync("./src/Actions.json", "utf8"));
console.log(`fetching from json file`);

const userSocketMap = {};
function getAllConnectedClients(roomId) {
  // Map
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    },
  );
}

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on(actions.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    console.log("Joining room", roomId);
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // socket.in(roomId).emit(actions.USER_JOINED, { clients, username });
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(actions.USER_JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(actions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
      socket.leave(roomId);
    });
    delete userSocketMap[socket.id];
  });

  socket.on(actions.CODE_CHANGE, ({ roomId, code }) => {
    console.log(`received code: ${code}`);
    //NOTE: .in means-> sending to all except the orign sender
    //.to means direct broadcasting
    socket.in(roomId).emit(actions.CODE_CHANGE, { code });
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
