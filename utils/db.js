const mysql2 = require('mysql2');

const pool = mysql2.createPool({
    host:'localhost',
    user:'root',
    password:'rohitmali',
    database:'online_flight_ticket_booking_system'
})

module.exports = pool

























