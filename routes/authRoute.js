const express = require("express");
const router = express.Router();
const authService = require("../services/authService");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const { db } = require("../config/db");

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

router.post("/addPost", async (req, res) => {
  const { caption, imageUrl } = req.body;
  console.log(req.body, "req.body");

  if (!caption || !imageUrl) {
    return res
      .status(400)
      .json({ error: "Both caption and imageUrl are required." });
  }

  // // Add the post to our "database"
  // db.query("INSERT INTO posts (text, image_url) VALUES (?, ?)", [
  //   caption,
  //   imageUrl,
  // ]);

  db.query(
    "INSERT INTO posts (image_url, text) VALUES (?, ?)",
    [imageUrl, caption],
    (error, result) => {
      console.log(error, result);
    }
  );

  return res.json({ success: true, message: "Post added successfully." });
});

router.get("/posts", (req, res) => {
  const query = "SELECT * FROM posts";
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error fetching posts." });
    } else {
      console.log(results, "results");
      res.json(results);
    }
  });
});

module.exports = router;
