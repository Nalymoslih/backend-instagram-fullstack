// auth.js

// const bcrypt = require("bcrypt");

// async function hashPassword(password) {
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(password, saltRounds);
//   return hashedPassword;
// }

// async function checkPassword(password, hashedPassword) {
//   const passwordMatch = await bcrypt.compare(password, hashedPassword);
//   return passwordMatch;
// }

// module.exports = { hashPassword, checkPassword };

// auth.js

const jwt = require("jsonwebtoken");

function generateToken(userId) {
  const secretKey = "your-secret-key"; // Change this to a strong secret
  const token = jwt.sign({ userId }, secretKey, { expiresIn: "1h" });
  return token;
}

module.exports = { generateToken };