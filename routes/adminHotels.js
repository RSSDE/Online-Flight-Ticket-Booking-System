const express = require("express");
const router = express.Router();
const db = require("../utils/db");


router.get("/hotel-bookings", (req, res) => {
  const sql = `
    SELECT
      b.booking_id,
      u.name AS user_name,
      h.hotel_name,
      h.city,
      b.check_in,
      b.check_out,
      b.rooms_booked,
      h.price_per_night,
      b.status,
      b.booking_date
    FROM hotel_bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN hotels h ON b.hotel_id = h.hotel_id
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("ADMIN HOTEL BOOKING ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
});

module.exports = router;
