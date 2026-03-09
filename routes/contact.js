const express = require("express");
const router = express.Router();
const db = require("../utils/db");

/**
 * POST: Save contact message
 */
router.post("/", (req, res) => {
  const { user_id, name, email, mobile, queryType, message } = req.body;

  if (!name || !email || !mobile || !message) {
    return res.status(400).json({
      message: "All required fields must be filled"
    });
  }

  const sql = `
    INSERT INTO contact_messages
    (user_id, name, email, mobile, query_type, message)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id || null, name, email, mobile, queryType, message],
    (err, result) => {
      if (err) {
        console.error("CONTACT SAVE ERROR:", err);
        return res.status(500).json({
          message: "Failed to submit request"
        });
      }

      res.json({
        message: "Request submitted successfully",
        ticket_id: result.insertId
      });
    }
  );
});

module.exports = router;
