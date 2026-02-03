const express = require("express");
const router = express.Router();
const db = require("../utils/db");


router.get("/dashboard-stats", (req, res) => {
  const statsQuery = `
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM flights) AS total_flights,
      (SELECT COUNT(*) FROM bookings) AS total_bookings
  `;

  db.query(statsQuery, (err, statsResult) => {
    if (err) {
      console.error("STATS ERROR:", err);
      return res.status(500).json({ message: "Stats DB error" });
    }

    const recentBookingsQuery = `
      SELECT
        b.booking_id,
        u.name AS user_name,
        f.flight_number,
        b.status
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN flightschedule fs ON b.schedule_id = fs.schedule_id
      JOIN flights f ON fs.flight_id = f.flight_id
      ORDER BY b.booking_date DESC
      LIMIT 5
    `;

    db.query(recentBookingsQuery, (err, bookingsResult) => {
      if (err) {
        console.error("RECENT BOOKINGS ERROR:", err);
        return res.status(500).json({ message: "Bookings DB error" });
      }

      res.json({
        stats: statsResult[0],
        recentBookings: bookingsResult,
      });
    });
  });
});

module.exports = router;
