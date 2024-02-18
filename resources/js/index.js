// References to HTML elements
const nameInput = document.getElementById("my-name-input");
const messageInput = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const chatBox = document.getElementById("chat");

// Server URL
const serverURL = `https://it3049c-chat.fly.dev/messages`;

// Function to fetch messages from the server
function fetchMessages() {
    return fetch(serverURL)
        .then(response => response.json());
}

// Check if name is already saved in localStorage
const savedName = localStorage.getItem("chatUsername");

// Formatter function for message objects
function formatMessage(message, myNameInput) {
    const time = new Date(message.timestamp);
    const formattedTime = `${time.getHours()}:${time.getMinutes()}`;

    if (myNameInput === message.sender) {
        return `
        <div class="mine messages">
            <div class="message">
                ${message.text}
            </div>
            <div class="sender-info">
                ${formattedTime}
            </div>
        </div>
        `;
    } else {
        return `
        <div class="yours messages">
            <div class="message">
                ${message.text}
            </div>
            <div class="sender-info">
                ${message.sender} ${formattedTime}
            </div>
        </div>
        `;
    }
}

// Function to update messages in the chat box
async function updateMessages() {
    // Fetch Messages
    const messages = await fetchMessages();

    // Loop over the messages
    let formattedMessages = "";
    messages.forEach(message => {
        formattedMessages += formatMessage(message, nameInput.value);
    });

    // Clear and update the chat box
    chatBox.innerHTML = formattedMessages;
}

// Initial call to updateMessages
updateMessages();

// Set interval to call updateMessages every 10 seconds
const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);


// Function to send messages to the server
function sendMessages(username, text) {
  const newMessage = {
      sender: username,
      text: text,
      timestamp: new Date().getTime() // Using getTime() to get the timestamp in milliseconds
  };

  fetch(serverURL, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMessage)
  });
}

// Event listener for the send button
sendButton.addEventListener("click", function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = messageInput.value;

  sendMessages(sender, message);
  messageInput.value = "";
});

// Event listener for Save Username button
saveUsernameButton.addEventListener("click", function() {
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem("chatUsername", name);
    } else {
        localStorage.removeItem("chatUsername");
    }
});

// Disable message input until a name is provided and saved to localStorage
messageInput.disabled = true;
sendButton.disabled = true;

if (savedName) {
    nameInput.value = savedName;
    messageInput.disabled = false;
    sendButton.disabled = false;
}

// Event listener for name input change
nameInput.addEventListener("input", function() {
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem("chatUsername", name);
        messageInput.disabled = false;
        sendButton.disabled = false;
    } else {
        localStorage.removeItem("chatUsername");
        messageInput.disabled = true;
        sendButton.disabled = true;
    }
});