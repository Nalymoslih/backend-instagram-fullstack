const express = require("express");
// const mysql = require("mysql");
const app = express();
app.use(express.json());

const router = express.Router();

const { db } = require("./index");
const { hashPassword, checkPassword, generateToken } = require("./auth");
const http = require("http");
// const { log } = require("console");

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/api/signup", async (req, res) => {
  const { email, username, password } = req.body;

  const hashedPassword = await hashPassword(password);
  console.log(hashPassword);
  console.log("req.body", req.body);

  const query =
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
  const values = [username, email, hashedPassword];

  // Hash and salt the password before storing it in the database

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database query failed" });
    } else {
      res.status(200).json({ message: "User registered successfully" });
    }
  });
});

// app.use("/api", router);
// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log("req.body", req.body);
  const query = "SELECT * FROM users WHERE email = ?";

  db.query(query, [username], (err, results) => {
    console.log({ results });
    if (err) {
      res.status(500).json({ error: "Database query failed" });
    } else {
      if (results.length === 0) {
        res.status(401).json({ error: "User not found" });
      } else {
        const user = results[0];
        if (checkPassword(password, user.password)) {
          // Generate a token and send it to the client for future authentication
          const token = generateToken(user.id);

          // Set the Content-Type header to indicate JSON response
          res.setHeader("Content-Type", "application/json");

          res.status(200).json({ token });
        } else {
          res.status(401).json({ error: "Invalid password" });
        }
      }
    }
  });
});

app.use("/api", router);

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
    "INSERT INTO users (username, phone, email, password) VALUES (?, ?, ?, ?)";

  const { username, phone, email, password } = userData;

  db.query(query, [username, phone, email, password], (err, results) => {
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
