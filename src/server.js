import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const ioServer = new Server(httpServer);

// 공개 방 업데이트 로직
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
    console.log(socket.rooms);
    socket.to(roomName).emit("greeting", socket["nickname"]);
    ioServer.sockets.emit("roomUpdate", updatePublicRoom()); // 입장하며 방에 업데이트하기

    socket.on("message", (message, sendMessage) => {
      message = `${socket["nickname"]}: ${message}`;
      socket.to(roomName).emit("sendMessage", message, sendMessage(message));
    });
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("goodbye", socket["nickname"])
    );
    ioServer.sockets.emit("roomUpdate", updatePublicRoom()); // 퇴장하며 방에 업데이트하기
  });

  socket.on("nickname", (nickname, saveNickname) => {
    socket["nickname"] = nickname;
    console.log(`설정한 닉네임: ${socket["nickname"]}`);
    saveNickname(nickname);
  });
});

httpServer.listen(8000);
