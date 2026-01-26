const express = require("express");
const pool = require("../utils/db");
const result = require("../utils/result");

const router = express.Router();


router.get("/schedule/:scheduleId/seats", (req, res) => {
  const { scheduleId } = req.params;

  const sql = `SELECT
  fs.schedule_id,
  f.flight_number,

  -- total seats in aircraft
  (
    SELECT COUNT(*)
    FROM seats s
    WHERE s.aircraft_id = f.aircraft_id
  ) AS total_seats,

  -- booked seats for this schedule
  (
    SELECT COUNT(*)
    FROM passengers p
    JOIN bookings b ON p.booking_id = b.booking_id
    WHERE b.schedule_id = fs.schedule_id
  ) AS booked_seats,

  -- available seats
  (
    (
      SELECT COUNT(*)
      FROM seats s
      WHERE s.aircraft_id = f.aircraft_id
    ) -
    (
      SELECT COUNT(*)
      FROM passengers p
      JOIN bookings b ON p.booking_id = b.booking_id
      WHERE b.schedule_id = fs.schedule_id
    )
  ) AS available_seats

FROM flightschedule fs
JOIN flights f ON fs.flight_id = f.flight_id
WHERE fs.schedule_id = ?;
`;

  db.query(sql, [scheduleId], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(result[0]);
  });
});







// Get all schedules
router.get('/getAllflights', (req, res) => {
    const sql = "SELECT * FROM FlightSchedule";
    pool.query(sql, (err, data) => {
    res.send(result.createResult(err, data));
        
    });
});

// // Get schedule by ID
router.get('/:id', (req, res) => {
    const scheduleId = req.params.id;
    const sql = "SELECT * FROM FlightSchedule WHERE schedule_id = ?";
    pool.query(sql, [scheduleId], (err, data) => {
    res.send(result.createResult(err, data));
    });
});


// Create schedule
router.post('/addflightschedules', (req, res) => {
    const { flight_id, departure_time, arrival_time, price } = req.body;
    const sql = "INSERT INTO FlightSchedule (flight_id, departure_time, arrival_time, price) VALUES (?, ?, ?, ?)";
    pool.query(sql, [flight_id, departure_time, arrival_time, price], (err, data) => {
        if (err) return res.status(500).json({ success: false, error: err });
        res.json({ success: true, message: "Schedule created", schedule_id: data.insertId });
    });
});

// Update full schedule (PUT)
router.put('/flightschedulesUpdate/:id', (req, res) => {
    const scheduleId = req.params.id;
    const { flight_id, departure_time, arrival_time, price } = req.body;
    const sql = "UPDATE FlightSchedule SET flight_id = ?, departure_time = ?, arrival_time = ?, price = ? WHERE schedule_id = ?";
    pool.query(sql, [flight_id, departure_time, arrival_time, price, scheduleId], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });
        res.json({ success: true, message: "Schedule updated" });
    });
});


// Delete schedule
router.delete('/FlightScheduleDelete/:id', (req, res) => {
    const scheduleId = req.params.id;
    const sql = "DELETE FROM FlightSchedule WHERE schedule_id = ?";
    pool.query(sql, [scheduleId], (err, data) => {
        res.send(result.createResult(err, data));
        res.json({ success: true, message: "Schedule deleted" });
    });
});

module.exports = router;
