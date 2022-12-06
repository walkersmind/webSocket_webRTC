const socket = io();

const room = document.querySelector("#room");
const roomForm = room.querySelector("form");
const chat = document.querySelector("#chat");
const chatForm = chat.querySelector("form");
const nicknameSet = document.querySelector("#nickname");
const nicknameForm = nickname.querySelector("form");

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

function showRoom(roomName) {
  // 로직 흐름에 따라 상황에 맞는 div 표시해주기
  room.hidden = true;
  nicknameSet.hidden = true;
  chat.hidden = false;

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

// 닉네임 저장하기
function saveNickname(nickname) {
  room.hidden = false;
  nicknameSet.hidden = true;
  chat.hidden = true;

  roomForm.querySelector("input").focus();

  // 채팅방 이름에 이벤트 리스너 추가
  roomForm.addEventListener("submit", handleRoomName);
}

// 닉네임 버튼 핸들러
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
