const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const clients = {};

io.on("connection", (socket) => {
  clients[socket.id] = socket;
  console.log("User Connected", socket.id);

  socket.on("offer", ({ offer, to }) => {
    if (clients[to]) {
      clients[to].emit("offer", { offer, from: socket.id });
    }
  });

  socket.on("answer", ({ answer, to }) => {
    if (clients[to]) {
      clients[to].emit("answer", { answer, from: socket.id });
    }
  });

  socket.on("iceCandidate", ({ candidate, to }) => {
    if (clients[to]) {
      clients[to].emit("iceCandidate", { candidate });
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    delete clients[socket.id];
  });
});

app.get("/", (req, res) => {
  res.json({ success: true });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
