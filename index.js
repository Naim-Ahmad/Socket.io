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
  clients.userId = socket.id;
  console.log("User Connected", socket.id);
  socket.on("offer", (offer) => {
    // console.log(offer);
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });
  socket.on("iceCandidate", (iceCandidate) => {
    // console.log(iceCandidate);
    socket.broadcast.emit("iceCandidate", iceCandidate);
  });
});

app.get("/", (req, res) => {
  res.json({ success: true });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
