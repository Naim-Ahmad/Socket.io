const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change this for security)
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle offer (when caller sends SDP offer)
  socket.on("offer", ({ target, offer }) => {
    console.log(`Offer from ${socket.id} to ${target}`);
    io.to(target).emit("offer", { target: socket.id, offer });
  });

  // Handle answer (when callee responds with SDP answer)
  socket.on("answer", ({ target, answer }) => {
    console.log(`Answer from ${socket.id} to ${target}`);
    io.to(target).emit("call-answered", { caller: socket.id, answer });
  });

  // Handle ICE candidates
  socket.on("ice-candidate", ({ target, candidate }) => {
    console.log(`ICE candidate from ${socket.id} to ${target}`);
    io.to(target).emit("ice-candidate", { candidate });
  });

  // Handle call ending
  socket.on("end-call", ({ peer }) => {
    console.log(`Call ended by ${socket.id} for ${peer}`);
    io.to(peer).emit("call-ended", { caller: socket.id });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // io.emit("user-list", Object.keys(users));
  });
});

server.listen(4000, () => {
  console.log("Server is running on port 4000");
});
