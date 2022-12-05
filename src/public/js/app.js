const messageList = document.querySelector("ul");
const nicknameForm = document.querySelector("#nickname");
const messageForm = document.querySelector("#message");

const socket = new WebSocket(`ws://${window.location.host}`);

// 메시지를 JSON 데이터로 바꿔주기
function JSONMessage(type, payload) {
  const message = { type, payload };
  return JSON.stringify(message);
}

socket.addEventListener("open", () => {
  console.log("Connected to Server.");
});

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnted from the server.");
});

// 메시지 전송 핸들러
function handleSubmit(event) {
  event.preventDefault();

  const input = messageForm.querySelector("input");

  socket.send(JSONMessage("newMessage", input.value));
  input.value = "";
}

//닉네임 설정 핸들러
function handleNicknameSubmit(event) {
  event.preventDefault();

  const nickname = nicknameForm.querySelector("input");
  socket["nickname"] = nickname.value; // 닉네임 값을 socket에 넣어 줌

  socket.send(JSONMessage("nickName", socket["nickname"]));

  nickname.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nicknameForm.addEventListener("submit", handleNicknameSubmit);
