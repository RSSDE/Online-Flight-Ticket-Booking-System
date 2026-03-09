const express = require("express");
const db = require("../utils/db");

const router = express.Router();


router.post("/pay", (req, res) => {
  const { booking_id, amount, payment_method } = req.body;

  if (!booking_id || !amount || !payment_method) {
    return res.status(400).json({ message: "Missing payment details" });
  }

  const sql = `
    INSERT INTO payments (booking_id, amount, payment_method, status)
    VALUES (?, ?, ?, 'SUCCESS')
  `;

  db.query(sql, [booking_id, amount, payment_method], (err, result) => {
    if (err) {
      console.error("Payment insert error:", err);
      return res.status(500).json({ message: "Payment failed" });
    }

    
    db.query(
      "UPDATE bookings SET status='CONFIRMED' WHERE booking_id=?",
      [booking_id]
    );

    res.json({
      message: "Payment successful",
      payment_id: result.insertId,
    });
  });
});

module.exports = router;
