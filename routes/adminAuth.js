const express = require("express");
const router = express.Router();
const db = require("../utils/db");

/* ===============================
   ADMIN LOGIN (PLAIN PASSWORD)
================================ */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN TRY:", email, password);

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  db.query(
    "SELECT * FROM admin WHERE email = ?",
    [email],
    (err, result) => {
      if (err) {
        console.error("DB ERROR:", err);
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Admin not found" });
      }

      const admin = result[0];

      console.log("DB PASSWORD:", admin.password);

      // ✅ PLAIN TEXT COMPARISON (GUARANTEED)
      if (password !== admin.password) {
        return res.status(401).json({ message: "Invalid password" });
      }

      res.json({
        message: "Admin login successful",
        admin: {
          admin_id: admin.admin_id,
          username: admin.username,
          email: admin.email
        }
      });
    }
  );
});

module.exports = router;
