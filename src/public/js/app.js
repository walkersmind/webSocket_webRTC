const socket = io();

const room = document.querySelector("#room");
let roomName = room.querySelector("form");
const chat = document.querySelector("#chat");
const chatting = chat.querySelector("form");

chat.hidden = true; // 처음에 채팅 창 가려주기

const showRoom = (userRoomName) => {
  room.hidden = true; // 방 이름 입력창 가려주기
  chat.hidden = false; // 채팅창 보여주기

  const roomNameHeader = chat.querySelector("h2"); // 입장한 방 이름 보여주기
  roomNameHeader.innerText = `Room: ${roomName}`;
};

function handleRoomName(event) {
  event.preventDefault();

  const input = roomName.querySelector("input");
  roomName = input.value;

  socket.emit("room", { payload: input.value }, showRoom);
}

roomName.addEventListener("submit", handleRoomName);
