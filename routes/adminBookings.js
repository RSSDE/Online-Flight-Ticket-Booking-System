const express = require("express");
const router = express.Router();
const db = require("../utils/db");


router.get("/bookings", (req, res) => {
  const sql = `
    SELECT 
      b.booking_id,
      u.name AS user_name,
      f.flight_number,
      b.status,
      b.booking_date
    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN flightschedule fs ON b.schedule_id = fs.schedule_id
    JOIN flights f ON fs.flight_id = f.flight_id
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("ADMIN BOOKING HISTORY ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
});

module.exports = router;
