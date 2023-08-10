const express = require("express");
// const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const { db } = require("./config/db");
const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"],
  },
});
// Middleware
// app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);
// Inside the Socket.io connection handler
io.on("connection", (socket) => {
  socket.on("join", (room) => {
    socket.join(room);
    db.query(
      "SELECT * FROM messages WHERE room_id = ? ORDER BY timestamp DESC",
      [room],
      (error, results) => {
        if (error) {
          console.error("Error retrieving messages:", error);
        } else {
          console.log("Messages retrieved from database:", results);
          io.emit("messages", results);
        }
      }
    );
  });

  socket.on("message", async (data) => {
    try {
      const { senderId, receiverId, room, message } = data;
      // Check if the sender and receiver are participants of the room
      const participants = await getRoomParticipants(room);

      if (
        participants.includes(senderId) &&
        participants.includes(receiverId)
      ) {
        // Store the message in the database
        db.query(
          "INSERT INTO messages (sender_id, receiver_id, room_id, message) VALUES (?, ?, ?, ?)",
          [senderId, receiverId, room, message],
          (error, result) => {
            if (error) {
              console.error("Error storing message:", error);
            } else {
              console.log("Message stored in the database:", result.insertId);
              const message = db.query(
                "SELECT * FROM messages WHERE id = ?",
                [result.insertId],
                (error, result) => {
                  if (error) {
                    console.error("Error retrieving message:", error);
                  } else {
                    console.log("Message retrieved from database:", result[0]);

                    io.emit("message", result[0]);
                  }
                }
              );
            }
          }
        );
      } else {
        console.log("fuyck off");
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Function to retrieve room participants
async function getRoomParticipants(roomId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT user_id FROM room_participants WHERE room_id = ?",
      [roomId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          const participants = results.map((row) => row.user_id);
          resolve(participants);
        }
      }
    );
  });
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
