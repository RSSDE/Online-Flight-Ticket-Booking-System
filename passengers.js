const express = require('express')
const pool = require('../utils/db')
const result = require('../utils/result')

const router = express.Router()


// router.get('/', (req, res) => {
//     const sql = `SELECT * FROM passengers`
//     pool.query(sql, (err, data) => {
//         res.send(result.createResult(err, data))
//     })
// })
// 1. GET ALL - Only passengers belonging to the logged-in user's bookings
router.get('/', (req, res) => {
    const uid = req.headers.uid // Provided by your authorizeUser middleware
    const sql = `
        SELECT p.* FROM passengers p
        JOIN Bookings b ON p.booking_id = b.booking_id
        WHERE b.user_id = ?`

    pool.query(sql, [uid], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

// router.get('/:id', (req, res) => {
//     const sql = `SELECT * FROM passengers WHERE passenger_id = ?`
//     pool.query(sql, [req.params.id], (err, data) => {
//         res.send(result.createResult(err, data))
//     })
// })


// 2. GET BY ID - Securely fetch a single passenger
router.get('/:id', (req, res) => {
    const uid = req.headers.uid
    const sql = `
        SELECT p.* FROM passengers p
        JOIN Bookings b ON p.booking_id = b.booking_id
        WHERE p.passenger_id = ? AND b.user_id = ?`

    pool.query(sql, [req.params.id, uid], (err, data) => {
        if (data && data.length === 0) {
            res.send(result.createResult("Passenger not found or access denied"))
        } else {
            res.send(result.createResult(err, data[0]))
        }
    })
})


// router.post('/', (req, res) => {
//     const { booking_id, passenger_name, age, gender, seat_id } = req.body
//     const sql = `INSERT INTO passengers (booking_id, passenger_name, age, gender, seat_id) VALUES (?,?,?,?,?)`
//     pool.query(sql, [booking_id, passenger_name, age, gender, seat_id], (err, data) => {
//         res.send(result.createResult(err, data))
//     })
// })

router.post('/', (req, res) => {
    const { booking_id, passenger_name, age, gender, seat_id } = req.body
        // Logic: Insert record. (Optional: Check if user owns the booking_id first)
    const sql = `INSERT INTO passengers (booking_id, passenger_name, age, gender, seat_id) VALUES (?,?,?,?,?)`

    pool.query(sql, [booking_id, passenger_name, age, gender, seat_id], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

// router.put('/:id', (req, res) => {
//     const passenger_id = req.params.id
//     const { passenger_name, age, gender, seat_id } = req.body
//     const sql = `UPDATE passengers SET passenger_name = ?, age = ?, gender = ?, seat_id = ? WHERE passenger_id = ?`
//     pool.query(sql, [passenger_name, age, gender, seat_id, passenger_id], (err, data) => {
//         res.send(result.createResult(err, data))
//     })
// })

// 4. PUT - Securely update passenger details
router.put('/:id', (req, res) => {
    const passenger_id = req.params.id
    const uid = req.headers.uid
    const { passenger_name, age, gender, seat_id } = req.body

    // The JOIN ensures User A cannot edit User B's passengers
    const sql = `
        UPDATE passengers p
        JOIN Bookings b ON p.booking_id = b.booking_id
        SET p.passenger_name = ?, p.age = ?, p.gender = ?, p.seat_id = ? 
        WHERE p.passenger_id = ? AND b.user_id = ?`

    pool.query(sql, [passenger_name, age, gender, seat_id, passenger_id, uid], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

//5. PATCH -

router.patch('/:id', (req, res) => {
    const passenger_id = req.params.id
    const uid = req.headers.uid // Provided by your authorizeUser middleware
    const fields = req.body

    // 1. Dynamically build the SET part of the query
    const fieldNames = Object.keys(fields)
    if (fieldNames.length === 0) {
        return res.send(result.createResult("No fields provided for update"))
    }

    const setClause = fieldNames.map(name => `p.${name} = ?`).join(', ')
    const values = Object.values(fields)

    // 2. Add passenger_id and uid for the WHERE clause
    values.push(passenger_id)
    values.push(uid)

    // 3. Execute the secure JOIN query
    const sql = `
        UPDATE passengers p
        JOIN Bookings b ON p.booking_id = b.booking_id
        SET ${setClause}
        WHERE p.passenger_id = ? AND b.user_id = ?`

    pool.query(sql, values, (err, data) => {
        if (err) {
            res.send(result.createResult(err))
        } else if (data.affectedRows === 0) {
            res.send(result.createResult("Update failed: Passenger not found or unauthorized"))
        } else {
            res.send(result.createResult(null, "Passenger updated successfully"))
        }
    })
})

// router.delete('/:id', (req, res) => {
//     const passenger_id = req.params.id
//     const sql = `DELETE FROM passengers WHERE passenger_id = ?`
//     pool.query(sql, [passenger_id], (err, data) => {
//         res.send(result.createResult(err, data))
//     })
// })

// 6. DELETE - Securely remove a passenger
router.delete('/:id', (req, res) => {
    const passenger_id = req.params.id
    const uid = req.headers.uid

    const sql = `
        DELETE p FROM passengers p
        JOIN Bookings b ON p.booking_id = b.booking_id
        WHERE p.passenger_id = ? AND b.user_id = ?`

    pool.query(sql, [passenger_id, uid], (err, data) => {
        res.send(result.createResult(err, data))
    })
})

module.exports = router