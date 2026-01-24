const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()

/* ======================================================
   GET ALL PAYMENTS (LOGGED-IN USER ONLY)
   ====================================================== */
router.get('/', (req, res) => {
    const uid = req.headers.uid

    if (!uid) {
        return res.send(result.createResult("Unauthorized"))
    }

    const sql = `
    SELECT p.*
    FROM Payments_Gateways p
    JOIN Bookings b ON p.booking_id = b.booking_id
    WHERE b.user_id = ?
  `

    pool.query(sql, [uid], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

/* ======================================================
   GET PAYMENT BY ID (SECURE)
   ====================================================== */
router.get('/:payment_id', (req, res) => {
    const { payment_id } = req.params
    const uid = req.headers.uid

    const sql = `
    SELECT p.*
    FROM Payments_Gateways p
    JOIN Bookings b ON p.booking_id = b.booking_id
    WHERE p.payment_id = ? AND b.user_id = ?
  `

    pool.query(sql, [payment_id, uid], (err, data) => {
        if (err) {
            res.send(result.createResult(err))
        } else if (data.length === 0) {
            res.send(result.createResult("Payment not found or unauthorized"))
        } else {
            res.send(result.createResult(null, data[0]))
        }
    })
})

/* ======================================================
   PROCESS PAYMENT (TRANSACTION)
   ====================================================== */
router.post('/process', (req, res) => {
    const { booking_id, amount, payment_method } = req.body
    const uid = req.headers.uid

    if (!uid) {
        return res.send(result.createResult("Unauthorized"))
    }

    pool.getConnection((err, connection) => {
        if (err) return res.send(result.createResult(err))

        connection.beginTransaction(err => {
            if (err) return res.send(result.createResult(err))

            // 1️. Verify booking ownership
            const verifyBooking = `
        SELECT * FROM Bookings
        WHERE booking_id = ? AND user_id = ?
      `

            connection.query(verifyBooking, [booking_id, uid], (err, booking) => {
                if (err || booking.length === 0) {
                    return connection.rollback(() =>
                        res.send(result.createResult("Invalid booking or unauthorized"))
                    )
                }

                // 2️.Insert payment as PENDING
                const insertPayment = `
          INSERT INTO Payments_Gateways
          (booking_id, amount, payment_method, status)
          VALUES (?, ?, ?, 'Pending')
        `

                connection.query(insertPayment, [booking_id, amount, payment_method], err => {
                    if (err) {
                        return connection.rollback(() =>
                            res.send(result.createResult("Payment initiation failed"))
                        )
                    }

                    // 3️. Simulate gateway response
                    const paymentStatus = 'Success' // Success | Failed

                    const updatePayment = `
            UPDATE Payments_Gateways
            SET status = ?
            WHERE booking_id = ?
          `

                    connection.query(updatePayment, [paymentStatus, booking_id], err => {
                        if (err) {
                            return connection.rollback(() =>
                                res.send(result.createResult("Payment status update failed"))
                            )
                        }

                        if (paymentStatus === 'Failed') {
                            return connection.rollback(() =>
                                res.send(result.createResult("Payment failed"))
                            )
                        }

                        // 4️.Confirm booking
                        const confirmBooking = `
              UPDATE Bookings
              SET status = 'Confirmed'
              WHERE booking_id = ?
            `

                        connection.query(confirmBooking, [booking_id], err => {
                            if (err) {
                                return connection.rollback(() =>
                                    res.send(result.createResult("Booking confirmation failed"))
                                )
                            }

                            // 5.Commit
                            connection.commit(err => {
                                if (err) {
                                    return connection.rollback(() =>
                                        res.send(result.createResult(err))
                                    )
                                }

                                res.send(result.createResult(null, {
                                    message: "Payment successful, ticket confirmed"
                                }))
                            })
                        })
                    })
                })
            })
        })
    })
})

/* ======================================================
   PUT PAYMENT (FULL UPDATE)
   ====================================================== */
router.put('/:payment_id', (req, res) => {
    const { payment_id } = req.params
    const { amount, payment_method, status } = req.body
    const uid = req.headers.uid

    const sql = `
    UPDATE Payments_Gateways p
    JOIN Bookings b ON p.booking_id = b.booking_id
    SET p.amount = ?, p.payment_method = ?, p.status = ?
    WHERE p.payment_id = ? AND b.user_id = ?
  `

    pool.query(
        sql, [amount, payment_method, status, payment_id, uid],
        (err, data) => {
            if (err) {
                res.send(result.createResult(err))
            } else if (data.affectedRows === 0) {
                res.send(result.createResult("Update failed or unauthorized"))
            } else {
                res.send(result.createResult(null, "Payment updated successfully"))
            }
        }
    )
})

/* ======================================================
   PATCH PAYMENT (PARTIAL UPDATE)
   ====================================================== */
router.patch('/:payment_id', (req, res) => {
    const { payment_id } = req.params
    const uid = req.headers.uid

    const fields = []
    const values = []

    if (req.body.amount !== undefined) {
        fields.push("p.amount = ?")
        values.push(req.body.amount)
    }

    if (req.body.payment_method !== undefined) {
        fields.push("p.payment_method = ?")
        values.push(req.body.payment_method)
    }

    if (req.body.status !== undefined) {
        fields.push("p.status = ?")
        values.push(req.body.status)
    }

    if (fields.length === 0) {
        return res.send(result.createResult("No fields provided for update"))
    }

    const sql = `
    UPDATE Payments_Gateways p
    JOIN Bookings b ON p.booking_id = b.booking_id
    SET ${fields.join(', ')}
    WHERE p.payment_id = ? AND b.user_id = ?
  `

    values.push(payment_id, uid)

    pool.query(sql, values, (err, data) => {
        if (err) {
            res.send(result.createResult(err))
        } else if (data.affectedRows === 0) {
            res.send(result.createResult("Patch failed or unauthorized"))
        } else {
            res.send(result.createResult(null, "Payment updated successfully"))
        }
    })
})

/* ======================================================
   DELETE PAYMENT (SECURE)
   ====================================================== */
router.delete('/:payment_id', (req, res) => {
    const { payment_id } = req.params
    const uid = req.headers.uid

    const sql = `
    DELETE p FROM Payments_Gateways p
    JOIN Bookings b ON p.booking_id = b.booking_id
    WHERE p.payment_id = ? AND b.user_id = ?
  `

    pool.query(sql, [payment_id, uid], (err, data) => {
        if (err) {
            res.send(result.createResult(err))
        } else if (data.affectedRows === 0) {
            res.send(result.createResult("Delete failed or unauthorized"))
        } else {
            res.send(result.createResult(null, "Payment deleted successfully"))
        }
    })
})

module.exports = router