const express = require("express");
const db = require("../utils/db");
const router = express.Router();

router.get("/:bookingId", (req, res) => {
  const bookingId = req.params.bookingId;

  const sql = `
    SELECT 
      b.booking_id,
      b.seat_number,            -- ✅ IMPORTANT

      p.passenger_name,
      p.age,
      p.gender,

      f.flight_number,

      src.city AS source_city,
      dest.city AS destination_city,

      fs.departure_time,
      fs.arrival_time,

      pay.amount,
      pay.payment_method
    FROM bookings b
    JOIN passenger p 
      ON b.booking_id = p.booking_id
    JOIN flightschedule fs 
      ON b.schedule_id = fs.schedule_id
    JOIN flights f 
      ON fs.flight_id = f.flight_id
    JOIN airports src 
      ON f.source_airport = src.airport_id
    JOIN airports dest 
      ON f.destination_airport = dest.airport_id
    JOIN payments pay 
      ON pay.booking_id = b.booking_id
    WHERE b.booking_id = ?
  `;

  db.query(sql, [bookingId], (err, results) => {
    if (err) {
      console.error("Ticket fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // ✅ send single object, not array
    res.json(results[0]);
  });
});

module.exports = router;

