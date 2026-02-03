const express = require("express");
const router = express.Router();
const db = require("../utils/db");

router.get("/schedule", (req, res) => {
  const { date, from, to } = req.query;

  // Safety check
  if (!date || !from || !to) {
    return res.json([]);
  }

  const sql = `
    SELECT
      fs.schedule_id,
      f.flight_number,

      a1.city AS source_city,
      a1.code AS source_code,

      a2.city AS destination_city,
      a2.code AS destination_code,

      fs.departure_time,
      fs.arrival_time,
      fs.price

    FROM flightschedule fs
    JOIN flights f ON fs.flight_id = f.flight_id

    JOIN airports a1 ON f.source_airport = a1.airport_id
    JOIN airports a2 ON f.destination_airport = a2.airport_id

    WHERE DATE(fs.departure_time) = ?
      AND a1.code = ?
      AND a2.code = ?

    ORDER BY fs.departure_time
  `;

  db.query(sql, [date, from, to], (err, result) => {
    if (err) {
      console.error("FLIGHT SCHEDULE ERROR:", err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(result);
  });
});

module.exports = router;
