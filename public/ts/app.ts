(function () {
  let webSocket: WebSocket;
  const messages = <HTMLElement>document.getElementById("messages");
  const wsOpen = <HTMLButtonElement>document.getElementById("ws-open");
  const wsClose = <HTMLButtonElement>document.getElementById("ws-close");
  const wsSend = <HTMLButtonElement>document.getElementById("ws-send");
  const wsInput = <HTMLInputElement>document.getElementById("ws-input");

  function showMessage(message: string) {
    if (!messages) {
      return;
    }

    messages.textContent += `\n${message}`;
    messages.scrollTop = messages?.scrollHeight;
  }

  function closeConnection() {
    if (!!webSocket) {
      webSocket.close();
    }
  }

  wsOpen.addEventListener("click", () => {
    closeConnection();

    webSocket = new WebSocket("ws://localhost:3030");

    webSocket.addEventListener("error", () => {
      showMessage("WebSocket error");
    });

    webSocket.addEventListener("open", () => {
      showMessage("WebSocket connection established");
    });

    webSocket.addEventListener("close", () => {
      showMessage("WebSocket connection closed");
    });

    webSocket.addEventListener("message", (message: MessageEvent<string>) => {
      showMessage(`Received message: ${message.data}`);
    });
  });

  wsClose.addEventListener("click", closeConnection);

  wsSend.addEventListener("click", () => {
    const inputValue = wsInput?.value;

    if (!inputValue) {
      return;
    } else if (!webSocket) {
      showMessage("No WebSocket connection");
      return;
    }

    webSocket.send(inputValue);
    showMessage(`Sent "${inputValue}"`);
    wsInput.value = "";
  });
})();
