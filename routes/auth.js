const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../utils/db");
const config = require("../utils/config");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  db.query(
    "SELECT user_id FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      db.query(
        "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, hashedPassword],
        (err, insertResult) => {
          if (err) {
            return res.status(500).json({ message: "Registration failed" });
          }

          res.status(201).json({
            message: "Registration successful",
            user_id: insertResult.insertId,
          });
        }
      );
    }
  );
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  db.query(
    "SELECT user_id, name, email, password FROM users WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: "User not found" });
      }

      const user = result[0];
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // 🔐 JWT TOKEN
    const token = jwt.sign(
  {
    user_id: user.user_id,
    email: user.email,
  },
  config.JWT_SECRET,
  {
    expiresIn: config.JWT_EXPIRES_IN || "1d", // 🛡️ fallback
  }
);


      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
});

/* 🔥 THIS LINE WAS MISSING */
module.exports = router;
