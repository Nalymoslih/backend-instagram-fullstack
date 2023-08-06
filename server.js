const express = require("express");
const mysql = require("mysql");
const { db } = require("./index.js");
const app = express();
app.use(express.json());

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
  const query = "SELECT * FROM relationship";
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
