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

ioServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("room", (roomName, showRoom) => {
    socket.join(roomName);
    showRoom(roomName);
    // 환영 메시지에 닉네임 추가
    socket.to(roomName).emit("greeting", socket["nickname"]);
    // 메시지 옆에 닉네임 추가
    socket.on("message", (message, addMessage) => {
      message = `${socket["nickname"]}: ${message}`;
      socket.to(roomName).emit("sendMessage", message, addMessage(message));
    });
  });
  // 퇴장 메시지에 닉네임 추가
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("goodbye", socket["nickname"])
    );
  });
  // 닉네임 설정 이벤트 처리
  socket.on("nickname", (nickname, saveNickname) => {
    socket["nickname"] = nickname;
    console.log(`설정한 닉네임: ${socket["nickname"]}`);
    saveNickname(nickname);
  });
});

httpServer.listen(8000);
