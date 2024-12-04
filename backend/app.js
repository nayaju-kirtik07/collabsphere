require("dotenv/config");
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const socketIo = require('socket.io');
const Message = require("./models/message");

const app = express();
const server = http.createServer(app);

const { connectToDatabase } = require("./database/workspace-db-connection.js");

const userRouter = require("./allRoutes/UserRouter.js");
const teamRouter = require("./allRoutes/teamRouter.js");
const taskRouter = require("./allRoutes/taskRouter.js");
const projectRouter = require("./allRoutes/projectRouter.js");
const sessionRouter = require("./allRoutes/sessionRouter.js");
const searchRouter = require("./allRoutes/searchRouter.js");

app.use(
  cors({
    origin: ["http://localhost:3000"], // Only allow requests from localhost:3000
    credentials: true,
  })
);
app.options("*", cors());

app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    },
  })
);

// Use your routers here
app.use("/", userRouter);
app.use("/", teamRouter);
app.use("/", taskRouter);
app.use("/", projectRouter);
app.use("/", sessionRouter);
app.use("/", searchRouter);

// Setup Socket.IO with CORS for localhost
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow only localhost:3000
    methods: ["GET", "POST"]
  }
});

// Socket.IO setup
console.log("Socket.IO server initialized");

const activeUsers = new Set();

io.on("error", (error) => {
  console.log("Socket.IO server error:", error);
});

io.on("connection", function (socket) {
  console.log("Made socket connection", socket.id);

  socket.on("user_connected", (userId) => {
    console.log("User connected:", userId);
    socket.userId = userId;
    activeUsers.add(userId);
    console.log("Active users:", Array.from(activeUsers)); // Log active users
    io.emit("user_connected", Array.from(activeUsers));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
    activeUsers.delete(socket.userId);
    console.log("Active users after disconnect:", Array.from(activeUsers)); // Log active users
    io.emit("user_disconnected", Array.from(activeUsers));
  });

  socket.on("send_message", async (data) => {
    console.log("Received message:", data);
    try {
      const newMessage = new Message({
        senderId: data.sender,
        receiverId: data.receiver,
        message: data.content
      });

      await newMessage.save();

      io.emit("receive_message", {
        _id: newMessage._id, 
        senderId: newMessage.senderId, 
        receiverId: newMessage.receiverId,
        content: newMessage.message,
        timestamp: newMessage.timestamp 
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on("typing", (data) => {
    console.log("User typing:", data);
    socket.broadcast.emit("user_typing", data);
  });
});

// Message fetching route (outside of Socket.IO handlers)
app.get('/api/v1/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort('timestamp');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error: error.message });
  }
});

// Connect to database and start server on localhost
connectToDatabase(() => {
  console.log("Successfully connected to database");

  // Listen only on localhost for local development
  server.listen(3001, 'localhost', () => {
    console.log(`Server is running on localhost:3001`);
  });
});
