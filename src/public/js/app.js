const socket = io();

const videRoomSelect = document.getElementById("videoRoomSelect");
const videoRoomSelectForm = videRoomSelect.querySelector("form");
const videoStreaming = document.getElementById("videoStreaming");

videoStreaming.hidden = true;

function showVideoStreaming() {
  videRoomSelect.hidden = true;
  videoStreaming.hidden = false;
}

function handleVideoRoomSelect(event) {
  event.preventDefault();

  const input = videoRoomSelectForm.querySelector("input");
  videoRoomName = input.value;

  socket.emit("videoRoomSelect", videoRoomName, showVideoStreaming);
}

videoRoomSelectForm.addEventListener("submit", handleVideoRoomSelect);

socket.on("videoGreeting", () => {
  console.log("Some has joined!");
});

const myFace = document.getElementById("myFace");
const audioMuteButton = document.getElementById("audioMute");
const audios = document.getElementById("audios");
const cameraOffButton = document.getElementById("cameraOff");
const cameras = document.getElementById("cameras");

let myStream;
let audioOn = true;
let cameraOn = true;

async function getMedia(audioId, cameraId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };

  const userSelectConstrains = {
    audio: { deviceId: { exact: audioId } },
    video: { deviceId: { exact: cameraId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      audioId || cameraId ? userSelectConstrains : initialConstrains
    );
    0;
    myFace.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}

getMedia();

async function getDevices() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    const videoInputs = devices.filter(
      (device) => device.kind === "videoinput"
    );
    const audioInputs = devices.filter(
      (device) => device.kind === "audioinput"
    );

    const cameraOptions = videoInputs.forEach((camera) => {
      const option = document.createElement("option");
      option.value = camera.deviceId;
      option.innerHTML = camera.label;
      cameras.appendChild(option);
    });

    const audiOptions = audioInputs.forEach((audio) => {
      const option = document.createElement("option");
      option.value = audio.deviceId;
      option.innerText = audio.label;
      audios.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
}

getDevices();

function handleAudioMute() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!audioOn) {
    audioMuteButton.innerText = "Mute";
    audioOn = true;
  } else {
    audioMuteButton.innerText = "Unmute";
    audioOn = false;
  }
}

function handleCameraOff() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!cameraOn) {
    cameraOffButton.innerText = "Camera Off";
    cameraOn = true;
  } else {
    cameraOffButton.innerText = "Camera On";
    cameraOn = false;
  }
}

function handleAudioName() {
  getMedia(audios.value, undefined);
}

function handleCameraName() {
  getMedia(undefined, cameras.value);
}

audioMuteButton.addEventListener("click", handleAudioMute);
cameraOffButton.addEventListener("click", handleCameraOff);
audios.addEventListener("input", handleAudioName);
cameras.addEventListener("input", handleCameraName);

// ********** ********** ********** //
// ********** 텍스트 채팅 ********** //
// ********** ********** ********** //
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

nicknameSet.hidden = true;
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
