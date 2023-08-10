const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
// Register
router.post("/register", (req, res) => {
  console.log(req);
  const { username, password, email } = req.body;
  authService.registerUser(username, email, password, (err, result) => {
    if (err) {
      console.log(err, "err");
      // res.redirect("/auth/register");
    } else {
      // res.send("User registered");
      res.json(result);
    }
  });
});

// Login
router.post("/login", (req, res) => {
  console.log(req, "req");
  const { username, password } = req.body;
  console.log(username, password);
  authService.getUserByUsername(username, (err, user) => {
    if (err || !user) {
      res.redirect("/auth/login");
    } else {
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (passwordMatch) {
        // res.cookie("secureCookie", user.token, {
        //   // secure: process.env.NODE_ENV !== "development",
        //   httpOnly: true,
        //   expires: dayjs().add(30, "days").toDate(),
        // });
        res.json({ ...user, password: undefined });
        // res.send("User logged in");
        // res.redirect("/auth/profile");
      } else {
        res.redirect("/auth/login");
      }
    }
  });
});

// Profile
router.get("/profile", (req, res) => {
  if (!req.session.userId) {
    res.redirect("/auth/login");
  } else {
    authService.getUserById(req.session.userId, (err, user) => {
      if (err || !user) {
        res.redirect("/auth/login");
      } else {
        res.render("profile", { user });
      }
    });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

router.post("/posts", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  const post = {
    title,
    content,
  };

  const query = "INSERT INTO posts SET ?";
  db.query(query, post, (err, result) => {
    if (err) {
      console.error("Error inserting post:", err);
      res
        .status(500)
        .json({ message: "An error occurred while inserting the post." });
    } else {
      res.status(201).json({ message: "Post inserted successfully." });
    }
  });
});

module.exports = router;
