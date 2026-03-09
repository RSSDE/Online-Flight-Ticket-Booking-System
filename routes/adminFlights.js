const express = require("express");
const router = express.Router();
const db = require("../utils/db");


router.post("/add-flight", (req, res) => {
  const {
    flight_number,
    airline_id,
    aircraft_id,
    source_airport,
    destination_airport
  } = req.body;


  if (
    !flight_number ||
    !airline_id ||
    !aircraft_id ||
    !source_airport ||
    !destination_airport
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (source_airport === destination_airport) {
    return res.status(400).json({
      message: "Source and destination cannot be same",
    });
  }

  const sql = `
    INSERT INTO flights
    (flight_number, airline_id, aircraft_id, source_airport, destination_airport)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      flight_number,
      airline_id,
      aircraft_id,
      source_airport,
      destination_airport
    ],
    (err, result) => {
      if (err) {
        console.error("ADD FLIGHT ERROR:", err);
        return res.status(500).json({
          message: "Failed to add flight",
        });
      }

      res.status(201).json({
        message: "Flight added successfully",
        flight_id: result.insertId,
      });
    }
  );
});

router.get("/flights", (req, res) => {
  db.query("SELECT * FROM flights", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }
    res.json(result);
  });
});


router.delete("/flight/:id", (req, res) => {
  const flightId = req.params.id;

  db.query(
    "DELETE FROM flights WHERE flight_id = ?",
    [flightId],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Delete failed" });
      }
      res.json({ message: "Flight deleted" });
    }
  );
});


router.put("/flight/:id", (req, res) => {
  const flightId = req.params.id;
  const {
    flight_number,
    airline_id,
    aircraft_id,
    source_airport,
    destination_airport,
  } = req.body;

  db.query(
    `UPDATE flights SET 
      flight_number = ?, 
      airline_id = ?, 
      aircraft_id = ?, 
      source_airport = ?, 
      destination_airport = ?
     WHERE flight_id = ?`,
    [
      flight_number,
      airline_id,
      aircraft_id,
      source_airport,
      destination_airport,
      flightId,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Update failed" });
      }
      res.json({ message: "Flight updated" });
    }
  );
});

module.exports = router;
