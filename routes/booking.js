const express = require("express");
const router = express.Router();
const db = require("../utils/db");

router.post("/create", (req, res) => {
  const { user_id, schedule_id } = req.body;

  console.log("BOOKING BODY =", req.body);


  if (!user_id || !schedule_id) {
    return res.status(400).json({
      message: "user_id and schedule_id are required",
    });
  }

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

router.post("/book-seat", (req, res) => {
  const { user_id, schedule_id, seat_number } = req.body;

  if (!user_id || !schedule_id || !seat_number) {
    return res.status(400).json({ message: "Missing data" });
  }

  // 1️⃣ Check if seat already booked
  const checkSql = `
    SELECT booking_id
    FROM bookings
    WHERE schedule_id = ?
      AND seat_number = ?
      AND status = 'CONFIRMED'
  `;

  db.query(checkSql, [schedule_id, seat_number], (err, result) => {
    if (err) {
      console.error("CHECK SEAT ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({ message: "Seat already booked" });
    }

    // 2️⃣ Book seat
    const insertSql = `
      INSERT INTO bookings
      (user_id, schedule_id, seat_number, booking_date, status)
      VALUES (?, ?, ?, NOW(), 'CONFIRMED')
    `;

    db.query(
      insertSql,
      [user_id, schedule_id, seat_number],
      (err, result) => {
        if (err) {
          console.error("BOOK SEAT ERROR:", err);
          return res
            .status(500)
            .json({ message: "Booking failed" });
        }

        res.json({
          message: "Seat booked successfully",
          booking_id: result.insertId
        });
      }
    );
  });
});

module.exports = router;
