const socket = io();

const room = document.querySelector("#room");
let roomName = room.querySelector("form");
const chat = document.querySelector("#chat");
const chatting = chat.querySelector("form");

function sendMessage(message) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleSendMessage(event) {
  event.preventDefault();

  const message = chatting.querySelector("input");
  socket.emit("message", message.value, sendMessage);
  message.value = "";
}

chat.hidden = true;

const showRoom = (userRoomName) => {
  room.hidden = true;
  chat.hidden = false;

  const roomNameHeader = chat.querySelector("h2");
  roomNameHeader.innerText = `Room: ${roomName}`;

  chatting.addEventListener("submit", handleSendMessage);
};

function handleRoomName(event) {
  event.preventDefault();

  const input = roomName.querySelector("input");
  roomName = input.value;

  socket.emit("room", roomName, showRoom);
}

roomName.addEventListener("submit", handleRoomName);

function sendMessage(message) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");

  li.innerText = message;
  ul.appendChild(li);
}

socket.on("greeting", () => {
  sendMessage("Someone has joined!");
});

socket.on("goodbye", () => {
  sendMessage("Someone has left.");
});

socket.on("sendMessage", sendMessage);
