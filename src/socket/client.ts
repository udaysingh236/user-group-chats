import io from "socket.io-client";
const user1Token = "user1_jwt_token_here";

// User 2's JWT Token
const user2Token = "user2_jwt_token_here";

// Function to connect a user to the Socket.IO server with the JWT token
function connectToSocket(token: string, userName: string) {
  const socket = io("http://localhost:3000", {
    auth: {
      token: token,
    },
  });

  // Automatically join a group when the connection is made
  socket.on("connect", () => {
    console.log(`${userName} connected to server!`);

    // Join a group (example: 'group123')
    socket.emit("join_group", "group123");
    console.log(`${userName} joined group: group123`);

    // Send a message to the group at regular intervals
    setInterval(() => {
      sendGroupMessage(socket, userName, "Hello from " + userName + "!");
    }, 5000);

    // Send private messages after some time
    setTimeout(() => {
      sendPrivateMessage(socket, userName, "user2", "Private message from " + userName + "!");
    }, 10000);
  });

  // Listen for group messages
  socket.on("group_message", (data) => {
    console.log(`[Group] ${data.from}: ${data.message}`);
  });

  // Listen for private messages
  socket.on("private_message", (data) => {
    console.log(`[Private] ${data.from}: ${data.message}`);
  });

  // Send a message to the group
  function sendGroupMessage(socket: any, userName: string, message: string) {
    socket.emit("group_message", { groupId: "group123", message });
    console.log(`${userName} sent to group123: ${message}`);
  }

  // Send a private message to a specific user
  function sendPrivateMessage(
    socket: any,
    fromuserName: string,
    touserName: string,
    message: string
  ) {
    socket.emit("private_message", { recipientId: touserName, message });
    console.log(`[Private] ${fromuserName} sent to ${touserName}: ${message}`);
  }
}

// Connect as User 1
connectToSocket(user1Token, "User1");

// Connect as User 2
connectToSocket(user2Token, "User2");
