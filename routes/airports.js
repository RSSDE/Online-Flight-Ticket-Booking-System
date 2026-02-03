const express = require("express");
const router = express.Router();
const db = require("../utils/db");

router.get("/", (req, res) => {
  const sql = `
    SELECT DISTINCT city, code
    FROM airports
    ORDER BY city
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("AIRPORT ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
});

module.exports = router;
