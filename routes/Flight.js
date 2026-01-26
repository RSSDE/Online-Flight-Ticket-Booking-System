const express = require("express");
const db = require("../utils/db"); 

const router = express.Router();

router.get("/search", (req, res) => {
  const { from, to } = req.query;

  console.log("SEARCH PARAMS:", from, to);

  if (!from || !to) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const sql = `
    SELECT 
      fs.schedule_id,
      f.flight_number,
      src.city AS source_city,
      dest.city AS destination_city,
      DATE(fs.departure_time) AS travel_date,
      TIME(fs.departure_time) AS departure_time,
      fs.price
    FROM flights f
    JOIN flightschedule fs ON f.flight_id = fs.flight_id
    JOIN airports src ON f.source_airport = src.airport_id
    JOIN airports dest ON f.destination_airport = dest.airport_id
    WHERE src.city = ?
      AND dest.city = ?
    ORDER BY fs.departure_time
  `;

  db.query(sql, [from, to], (err, results) => {
    if (err) {
      console.error("SQL ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    console.log("RESULT COUNT:", results.length);
    res.json(results);
  });
});


/* ================= GET AVAILABLE DATES ================= */
router.get("/dates", (req, res) => {
  const { from, to } = req.query;

  const sql = `
    SELECT DISTINCT DATE(fs.departure_time) AS travel_date
    FROM flights f
    JOIN flightschedule fs ON f.flight_id = fs.flight_id
    JOIN airports src ON f.source_airport = src.airport_id
    JOIN airports dest ON f.destination_airport = dest.airport_id
    WHERE src.city = ?
      AND dest.city = ?
    ORDER BY travel_date
  `;

  db.query(sql, [from, to], (err, results) => {
    if (err) {
      console.error("Date fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(results);
  });
});

/* ================= GET UNIQUE CITIES ================= */
router.get("/cities", (req, res) => {
  const sql = `
    SELECT DISTINCT
      CASE
        WHEN city IN ('Bengaluru', 'Bangalore') THEN 'Bangalore'
        WHEN city IN ('Cochin', 'Kochi') THEN 'Kochi'
        ELSE city
      END AS city
    FROM airports
    ORDER BY city
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("City fetch error:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(results);
  });
});

module.exports = router;
