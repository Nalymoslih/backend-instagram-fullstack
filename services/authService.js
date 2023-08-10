const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../config/db");
const authService = {
  registerUser: (username, email, password, callback) => {
    console.log(username, password);
    const hashedPassword = bcrypt.hashSync(password, 10);
    const token = generateAuthToken(username);
    const sql =
      "INSERT INTO users (username, password, email, token) VALUES (?, ?, ?, ?)";
    db.query(sql, [username, hashedPassword, email, token], (err, result) => {
      if (err) return callback(err, null);
      callback(null, {
        result,
        data: { username, email, token, id: result.insertId },
      });
    });
  },

  getUserByUsername: (username, callback) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },

  getUserById: (userId, callback) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },
};
const generateAuthToken = (username) => {
  const secretKey = "your-secret-key"; // Store this securely
  const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
  return token;
};

const verifyAuthToken = (token) => {
  const secretKey = "your-secret-key"; // Store this securely
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded.username;
  } catch (error) {
    return null;
  }
};

module.exports = authService;
