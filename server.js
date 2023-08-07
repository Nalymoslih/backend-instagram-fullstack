const express = require("express");
// const mysql = require("mysql");
const app = express();
app.use(express.json());

const { db } = require("./index");
const http = require("http");

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "<http://localhost:8000>",
  },
});

//👇🏻 Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.get("/api/data", (req, res) => {
  const query = "SELECT * FROM users";
  console.log("query", query);
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/messages", (req, res) => {
  const query = "SELECT * FROM messages";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/relationship", (req, res) => {
  const query = "SELECT * FROM user_relationships";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/api/data", (req, res) => {
  const userData = req.body; // Assuming you're sending user data in the request body
  const query =
    "INSERT INTO users (user_name, phone, email, password) VALUES (?, ?, ?, ?)";

  const { user_name, phone, email, password } = userData;

  db.query(query, [user_name, phone, email, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json({ message: "User data inserted successfully" });
    }
  });
});

app.post("/api/rooms", (req, res) => {
  const roomData = req.body;
  const query = "INSERT INTO chat_rooms (name) VALUES (?)";

  const { name } = roomData;

  db.query(query, [name], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json({ message: "Chat room created successfully" });
    }
  });
});

// Get all chat rooms
app.get("/api/rooms", (req, res) => {
  const query = "SELECT * FROM chat_rooms";
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json(results);
    }
  });
});

const PORT = 3010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
