//server.js

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
  }); // 발생하고 있는 이벤트를 로그
  socket.on("room", (roomName, showRoom) => {
    socket.join(roomName); // 채팅 방에 소켓 연결하기
    showRoom(); // room을 통해 넘어온 프론트의 함수를 프론트에서 실행하도록 트리거
  });
});

httpServer.listen(8000);
