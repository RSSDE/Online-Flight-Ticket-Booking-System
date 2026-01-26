const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../utils/db");

const router = express.Router();

/* ===============================
   REGISTER
================================ */
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
        console.error("DB select error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (result.length > 0) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      db.query(
        "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)",
        [name, email, phone, hashedPassword],
        (err, insertResult) => {
          if (err) {
            console.error("DB insert error:", err);
            return res.status(500).json({
              message: "Registration failed",
            });
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

/* ===============================
   LOGIN  (MOST IMPORTANT FIX)
================================ */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // ✅ validation
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
        console.error("DB error:", err);
        return res.status(500).json({
          message: "Database error",
        });
      }

      if (result.length === 0) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const user = result[0];
      const isMatch = bcrypt.compareSync(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      // ✅ SUCCESS (FRONTEND FRIENDLY)
      res.status(200).json({
        message: "Login successful",
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
});

module.exports = router;
