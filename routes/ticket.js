const express = require("express");
const db = require("../utils/db");

const router = express.Router();

/* ================= GET TICKET DETAILS ================= */
router.get("/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;

  const sql = `
    SELECT 
      p.passenger_name,
      p.age,
      p.gender,
      f.flight_number,
      src.city AS source_city,
      dest.city AS destination_city,
      DATE(fs.departure_time) AS travel_date,
      TIME(fs.departure_time) AS departure_time,
      pay.amount,
      pay.payment_method
    FROM bookings b
    JOIN passenger p ON b.booking_id = p.booking_id
    JOIN flightschedule fs ON b.schedule_id = fs.schedule_id
    JOIN flights f ON fs.flight_id = f.flight_id
    JOIN airports src ON f.source_airport = src.airport_id
    JOIN airports dest ON f.destination_airport = dest.airport_id
    JOIN payments pay ON pay.booking_id = b.booking_id
    WHERE b.booking_id = ?
  `;

  db.query(sql, [bookingId], (err, results) => {
    if (err) {
      console.error("Ticket fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(results);
  });
});

module.exports = router;
