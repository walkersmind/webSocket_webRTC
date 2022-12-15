import http from "http";
import { Server } from "socket.io";
import express from "express";
import { instrument } from "@socket.io/admin-ui";
import { createSocket } from "dgram";
import { sendStatus } from "express/lib/response";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: "https://admin.socket.io",
    credentials: true,
  },
});

instrument(ioServer, {
  auth: false,
});

function updatePublicRoom() {
  const {
    sockets: {
      adapter: { rooms, sids },
    },
  } = ioServer;

  let publicRooms = [];

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
}

ioServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("room", (roomName, showRoom) => {
    socket.join(roomName);
    showRoom(roomName);
    socket.to(roomName).emit("greeting", socket["nickname"]);
    ioServer.sockets.emit("roomUpdate", updatePublicRoom());

    socket.on("message", (message, sendMessage) => {
      message = `${socket["nickname"]}: ${message}`;
      socket.to(roomName).emit("sendMessage", message, sendMessage(message));
    });
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("goodbye", socket["nickname"])
    );
    ioServer.sockets.emit("roomUpdate", updatePublicRoom());
  });

  socket.on("nickname", (nickname, saveNickname) => {
    socket["nickname"] = nickname;
    saveNickname(nickname);
  });

  socket.on("videoRoomSelect", (videoRoomName, showVideoStreaming) => {
    socket.join(videoRoomName);
    showVideoStreaming();
    socket.to(videoRoomName).emit("videoGreeting");
  });

  socket.on("offer", (offer, videoRoomName) => {
    socket.to(videoRoomName).emit("offer", offer);
  });

  socket.on("answer", (answer, videoRoomName) => {
    socket.to(videoRoomName).emit("answer", answer);
  });

  socket.on("ice", (iceCandidates, videoRoomName) => {
    socket.to(videoRoomName).emit("ice", iceCandidates);
  });
});

httpServer.listen(8000);
