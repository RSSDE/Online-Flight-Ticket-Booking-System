
const express = require("express");
const router = express.Router();
const db = require("../utils/db");

/*
GET SEATS BY SCHEDULE ID

Flow:
schedule_id
 → flight_id
 → aircraft_id
 → seats (master data)
 → bookings (transaction data)
*/

router.get("/:scheduleId", (req, res) => {
  const { scheduleId } = req.params;

  // 1️⃣ schedule_id → flight_id
  const scheduleSql = `
    SELECT flight_id
    FROM flightschedule
    WHERE schedule_id = ?
  `;

  db.query(scheduleSql, [scheduleId], (err, scheduleRows) => {
    if (err || scheduleRows.length === 0) {
      return res.status(400).json({ message: "Invalid schedule" });
    }

    const flightId = scheduleRows[0].flight_id;

    // 2️⃣ flight_id → aircraft_id
    const aircraftSql = `
      SELECT aircraft_id
      FROM flights
      WHERE flight_id = ?
    `;

    db.query(aircraftSql, [flightId], (err, aircraftRows) => {
      if (err || aircraftRows.length === 0) {
        return res.status(400).json({ message: "Aircraft not found" });
      }

      const aircraftId = aircraftRows[0].aircraft_id;

      // 3️⃣ Get ALL seats of this aircraft (MASTER DATA)
      const seatsSql = `
        SELECT seat_number, class
        FROM seats
        WHERE aircraft_id = ?
        ORDER BY seat_number
      `;

      db.query(seatsSql, [aircraftId], (err, seatRows) => {
        if (err) {
          return res.status(500).json({ message: "Seat fetch error" });
        }

        // ⚠️ No seats defined = nothing to select
        if (seatRows.length === 0) {
          return res.json({
            scheduleId,
            flightId,
            aircraftId,
            totalSeats: 0,
            bookedSeats: 0,
            availableSeats: 0,
            seats: []
          });
        }

        // 4️⃣ Get BOOKED seats for this schedule (IGNORE NULLs)
        const bookedSql = `
          SELECT seat_number
          FROM bookings
          WHERE schedule_id = ?
            AND status = 'CONFIRMED'
            AND seat_number IS NOT NULL
        `;

        db.query(bookedSql, [scheduleId], (err, bookedRows) => {
          if (err) {
            return res.status(500).json({
              message: "Booking fetch error"
            });
          }

          // Convert booked seats to Set (fast lookup)
          const bookedSet = new Set(
            bookedRows.map(b => b.seat_number)
          );

          // 5️⃣ Merge MASTER seats + BOOKING status
          const finalSeats = seatRows.map(seat => ({
            seat_number: seat.seat_number,
            class: seat.class,
            status: bookedSet.has(seat.seat_number)
              ? "BOOKED"
              : "AVAILABLE"
          }));

          const totalSeats = finalSeats.length;
          const bookedCount = finalSeats.filter(
            s => s.status === "BOOKED"
          ).length;

          res.json({
            scheduleId,
            flightId,
            aircraftId,
            totalSeats,
            bookedSeats: bookedCount,
            availableSeats: totalSeats - bookedCount,
            seats: finalSeats
          });
        });
      });
    });
  });
});

module.exports = router;
