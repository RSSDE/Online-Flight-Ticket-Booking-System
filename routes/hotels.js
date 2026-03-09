const express = require("express");
const router = express.Router();
const db = require("../utils/db");


router.get("/", (req, res) => {
  const sql = `
    SELECT 
      h.hotel_id,
      h.hotel_name,
      h.city,
      h.price_per_night,

      h.total_rooms -
      IFNULL(
        (SELECT SUM(rooms_booked)
         FROM hotel_bookings
         WHERE hotel_id = h.hotel_id),
      0) AS available_rooms,

      (
        SELECT image_url
        FROM hotel_images
        WHERE hotel_id = h.hotel_id
        AND is_thumbnail = 1
        LIMIT 1
      ) AS thumbnail

    FROM hotels h
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("HOTELS API ERROR:", err);
      return res.status(500).json({ message: "DB error", error: err });
    }
    res.json(result);
  });
});




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
      b.booking_date,
      img.image_url AS hotel_image   -- ✅ IMPORTANT
    FROM hotel_bookings b
    JOIN hotels h 
      ON b.hotel_id = h.hotel_id
    LEFT JOIN hotel_images img
      ON h.hotel_id = img.hotel_id
     AND img.is_thumbnail = 1        -- ✅ thumbnail only
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

router.get("/:hotelId", (req, res) => {
  const { hotelId } = req.params;

  const hotelSql = `
    SELECT hotel_id, hotel_name, city, price_per_night
    FROM hotels
    WHERE hotel_id = ?
  `;

  const imageSql = `
    SELECT image_url
    FROM hotel_images
    WHERE hotel_id = ?
  `;

  db.query(hotelSql, [hotelId], (err, hotelResult) => {
    if (err || hotelResult.length === 0)
      return res.status(404).json({ message: "Hotel not found" });

    db.query(imageSql, [hotelId], (err, imageResult) => {
      if (err) return res.status(500).json({ message: "Image error" });

      res.json({
        ...hotelResult[0],
        images: imageResult.map(img => img.image_url)
      });
    });
  });
});


module.exports = router;
