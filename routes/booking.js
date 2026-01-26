const express = require("express");
const router = express.Router();
const db = require("../utils/db");

/* ===============================
   CREATE BOOKING
================================ */
router.post("/create", (req, res) => {
  const { user_id, schedule_id } = req.body;

  console.log("BOOKING BODY =", req.body);

  // validation
  if (!user_id || !schedule_id) {
    return res.status(400).json({
      message: "user_id and schedule_id are required",
    });
  }

  // 🔥 booking_date added using NOW()
  const sql = `
    INSERT INTO bookings (user_id, schedule_id, booking_date, status)
    VALUES (?, ?, NOW(), 'CONFIRMED')
  `;

  db.query(sql, [user_id, schedule_id], (err, result) => {
    if (err) {
      console.error("❌ BOOKINGS DB ERROR:", err.sqlMessage);
      return res.status(500).json({
        message: "Booking failed",
      });
    }

    res.status(201).json({
      message: "Booking successful",
      booking_id: result.insertId,
    });
  });
});

/* ===============================
   BOOKING HISTORY (USER WISE)
================================ */
router.get("/history/:user_id", (req, res) => {
  const { user_id } = req.params;

  const sql = `
    SELECT 
      b.booking_id,
      b.booking_date,
      b.status,
      f.flight_number,
      fs.departure_time,
      fs.arrival_time,
      fs.price
    FROM bookings b
    JOIN flightschedule fs ON b.schedule_id = fs.schedule_id
    JOIN flights f ON fs.flight_id = f.flight_id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.error("❌ HISTORY SQL ERROR:", err.sqlMessage);
      return res.status(500).json({
        message: "DB error",
        error: err.sqlMessage
      });
    }
    res.json(result);
  });
});


/* ===============================
   SINGLE BOOKING SUMMARY
================================ */
router.get("/:booking_id", (req, res) => {
  const { booking_id } = req.params;

  db.query(
    "SELECT * FROM bookings WHERE booking_id = ?",
    [booking_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "DB error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(result[0]);
    }
  );
});

module.exports = router;
