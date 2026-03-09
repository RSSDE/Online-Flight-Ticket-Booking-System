const express = require("express");
const router = express.Router();
const db = require("../utils/db");

/**
 * GET: All contact messages (Admin)
 */
router.get("/", (req, res) => {
  const sql = `
    SELECT
      message_id,
      user_id,
      name,
      email,
      mobile,
      query_type,
      message,
      status,
      created_at
    FROM contact_messages
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("ADMIN CONTACT ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
});

/**
 * UPDATE: Mark message as RESOLVED
 */
router.put("/:messageId", (req, res) => {
  const { messageId } = req.params;

  db.query(
    "UPDATE contact_messages SET status = 'RESOLVED' WHERE message_id = ?",
    [messageId],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Update failed" });
      }
      res.json({ message: "Marked as resolved" });
    }
  );
});

module.exports = router;
