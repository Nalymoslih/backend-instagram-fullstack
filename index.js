var mysql = require("mysql2");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "instagramClone",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  // var chat_rooms = `CREATE TABLE chat_rooms (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     name VARCHAR(255) NOT NULL,
  //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  //   )`;

  // con.query(chat_rooms, (err) => {
  //   if (err) {
  //     console.error("Error creating chat_rooms table:", err);
  //   } else {
  //     console.log("chat_rooms table created");
  //   }
  // });

  // var createUserTable = `
  //   CREATE TABLE IF NOT EXISTS users (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     user_name VARCHAR(255),
  //     phone VARCHAR(255),
  //     email VARCHAR(255),
  //     password VARCHAR(255)
  //   )
  // `;

  // const createMessagesTable = `
  //   CREATE TABLE IF NOT EXISTS messages (
  //     id INT AUTO_INCREMENT PRIMARY KEY,
  //     sender_id INT NOT NULL,
  //     recipient_id INT NOT NULL,
  //     content TEXT NOT NULL,
  //     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  //     FOREIGN KEY (sender_id) REFERENCES users(id),
  //     FOREIGN KEY (recipient_id) REFERENCES users(id)
  //   )
  // `;

  // const createPostsTable = `

  // CREATE TABLE user_relationships (
  //   follower_id INT NOT NULL,
  //   following_id INT NOT NULL,
  //   PRIMARY KEY (follower_id, following_id),
  //   FOREIGN KEY (follower_id) REFERENCES users(id),
  //   FOREIGN KEY (following_id) REFERENCES users(id)
  // )
  // `;
  // con.query(createPostsTable, (err) => {
  //   if (err) {
  //     console.error("Error creating Posts table:", err);
  //   } else {
  //     console.log("Posts table created");
  //   }
  // });

  // con.query(createUserTable, (err) => {
  //   if (err) {
  //     console.error("Error creating Users table:", err);
  //   } else {
  //     console.log("Users table created");
  //   }
  // });

  // con.query(createMessagesTable, (err) => {
  //   if (err) {
  //     console.error("Error creating Messages table:", err);
  //   } else {
  //     console.log("Messages table created");
  //   }
  // });
});

module.exports = {
  db: con,
};
