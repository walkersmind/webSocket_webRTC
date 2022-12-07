const socket = io();

const room = document.querySelector("#room");
const roomForm = room.querySelector("form");
const chat = document.querySelector("#chat");
const chatForm = chat.querySelector("form");
const nicknameSet = document.querySelector("#nickname");
const nicknameForm = nickname.querySelector("form");
const openPublicRoom = document.querySelector("#openPublicRoom");
const openPublicRoomList = openPublicRoom.querySelector("ul");

function sendMessage(message) {
  const ul = chat.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleSendMessage(event) {
  event.preventDefault();

  const message = chatForm.querySelector("input");
  socket.emit("message", message.value, sendMessage);
  message.value = "";
}

room.hidden = true;
chat.hidden = true;
openPublicRoom.hidden = true;

function showRoom(roomName) {
  room.hidden = true;
  nicknameSet.hidden = true;
  chat.hidden = false;
  openPublicRoom.hidden = false;

  const roomNameHeader = chat.querySelector("h2");
  roomNameHeader.innerText = `Room: ${roomName}`;

  chatForm.querySelector("input").focus();

  chatForm.addEventListener("submit", handleSendMessage);
}

function handleRoomName(event) {
  event.preventDefault();

  const input = roomForm.querySelector("input");
  const roomName = input.value;

  socket.emit("room", roomName, showRoom);
}

function saveNickname(nickname) {
  room.hidden = false;
  nicknameSet.hidden = true;
  chat.hidden = true;

  roomForm.querySelector("input").focus();

  roomForm.addEventListener("submit", handleRoomName);
}

function handleNickName(event) {
  event.preventDefault();

  const input = nicknameForm.querySelector("input");
  const nickname = input.value;

  socket.emit("nickname", nickname, saveNickname);
}

nicknameForm.addEventListener("submit", handleNickName);

socket.on("greeting", (nickname) => {
  sendMessage(`${nickname} has joined!`);
});

socket.on("goodbye", (nickname) => {
  sendMessage(`${nickname} has left!`);
});

socket.on("sendMessage", sendMessage);

socket.on("roomUpdate", (rooms) => {
  const li = openPublicRoomList.querySelector("li");
  li.innerText = `🚪 ${rooms}`;
});
