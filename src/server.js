import http from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));

const httpServer = http.createServer(app);
const ioServer = new Server(httpServer); // SocketIO 서버 구현

ioServer.on("connection", (socket) => {
  console.log(socket);
});

httpServer.listen(8000);
