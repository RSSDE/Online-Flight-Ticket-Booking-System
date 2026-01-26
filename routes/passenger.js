const express = require("express");
const db = require("../utils/db");

const router = express.Router(); // ✅ THIS WAS MISSING

// ADD PASSENGER
router.post("/add", (req, res) => {
  console.log("Passenger BODY:", req.body);

  const { booking_id, passenger_name, age, gender } = req.body;

  if (!booking_id || !passenger_name || !age || !gender) {
    return res.status(400).json({
      message: "booking_id, passenger_name, age and gender required",
    });
  }

  const sql = `
    INSERT INTO passenger
    (booking_id, passenger_name, age, gender)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [booking_id, passenger_name, Number(age), gender],
    (err, result) => {
      if (err) {
        console.error("❌ Passenger INSERT error:", err);
        return res.status(500).json({
          message: "Database error while adding passenger",
        });
      }

      res.json({
        message: "Passenger added successfully",
        passenger_id: result.insertId,
      });
    }
  );
});

module.exports = router; // ✅ MUST EXPORT
