import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });

const sockets = []; // sockets 배열 생성

webSocketServer.on("connection", (socket) => {
  sockets.push(socket); // 각 socket을 배열에 추가해주기
  console.log("Connected to Browser.");
  socket.on("open", () => console.log("Connected to the Browser"));
  socket.on("message", (message) => {
    sockets.forEach((eachSocket) => eachSocket.send(message.toString()));
  }); // 각 소켓으로부터 수신한 메시지를 에코잉해주기
  socket.on("close", () => console.log("Disconnectd from the Browser"));
});

server.listen(8000);
