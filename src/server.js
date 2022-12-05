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

const sockets = [];

webSocketServer.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickName"] = "Anonymous"; // 연결 시 닉네임 미설정이라면 기본값 부여
  socket.on("open", () => console.log("Connected to the Browser"));
  socket.on("message", (message) => {
    message = JSON.parse(message);

    // 메시지 유형을 구분해주기
    switch (message.type) {
      case "newMessage":
        sockets.forEach((eachSocket) =>
          eachSocket.send(`${socket.nickName}: ${message.payload.toString()}`)
        );
        break;
      case "nickName": // 닉네임 설정하기
        socket["nickName"] = message.payload;
        console.log(message.payload);
        break;
    }
  });
  socket.on("close", () => console.log("Disconnectd from the Browser"));
});

server.listen(8000);
