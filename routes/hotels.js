const express = require("express");
const router = express.Router();
const db = require("../utils/db");

/* =========================
   GET ALL HOTELS
========================= */
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      h.hotel_id,
      h.hotel_name,
      h.city,
      h.price_per_night,
      h.total_rooms -
      IFNULL(SUM(b.rooms_booked), 0) AS available_rooms
    FROM hotels h
    LEFT JOIN hotel_bookings b ON h.hotel_id = b.hotel_id
    GROUP BY h.hotel_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(result);
  });
});

/* =========================
   BOOK HOTEL
========================= */
router.post("/book", (req, res) => {
  const { user_id, hotel_id, check_in, check_out, rooms_booked } = req.body;

  if (!user_id || !hotel_id || !check_in || !check_out || !rooms_booked) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    `INSERT INTO hotel_bookings 
     (user_id, hotel_id, check_in, check_out, rooms_booked)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id, hotel_id, check_in, check_out, rooms_booked],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Booking failed" });
      res.json({ booking_id: result.insertId });
    }
  );
});

/* =========================
   HOTEL TICKET
========================= */
router.get("/ticket/:bookingId", (req, res) => {
  db.query(
    `
    SELECT 
      h.hotel_name,
      h.city,
      b.check_in,
      b.check_out,
      b.rooms_booked,
      h.price_per_night
    FROM hotel_bookings b
    JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE b.booking_id = ?
    `,
    [req.params.bookingId],
    (err, result) => {
      if (err || result.length === 0)
        return res.status(500).json({ message: "Ticket error" });
      res.json(result[0]);
    }
  );
});
/* =========================
   USER HOTEL BOOKING HISTORY
========================= */
router.get("/my-bookings/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT
      b.booking_id,
      h.hotel_name,
      h.city,
      b.check_in,
      b.check_out,
      b.rooms_booked,
      h.price_per_night,
      b.status,
      b.booking_date
    FROM hotel_bookings b
    JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE b.user_id = ?
    ORDER BY b.booking_date DESC
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("HOTEL HISTORY ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
});

/* =========================
   CANCEL HOTEL BOOKING
========================= */
router.put("/cancel/:bookingId", (req, res) => {
  const { bookingId } = req.params;

  db.query(
    `UPDATE hotel_bookings 
     SET status = 'CANCELLED' 
     WHERE booking_id = ?`,
    [bookingId],
    (err, result) => {
      if (err) {
        console.error("CANCEL HOTEL ERROR:", err);
        return res.status(500).json({ message: "Cancel failed" });
      }

      res.json({ message: "Booking cancelled" });
    }
  );
});

module.exports = router;
