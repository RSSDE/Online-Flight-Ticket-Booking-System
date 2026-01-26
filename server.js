const express = require("express");
const cors = require("cors");

// ROUTES
const FlightRouter = require("./routes/Flight");
const FlightScheduleRouter = require("./routes/FlightSchedule");
const AuthRouter = require("./routes/auth");
const PassengerRouter = require("./routes/passenger"); // ✅ FIXED
const BookingRouter = require("./routes/booking");
const PaymentRouter = require("./routes/payment");
const TicketRouter = require("./routes/ticket");
const adminAuthRoutes = require("./routes/adminAuth");
const adminFlightRoutes = require("./routes/adminFlights");








// DB CONNECTION
require("./utils/db");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES

app.use("/api/payment", PaymentRouter);
app.use("/api", AuthRouter);               // register & login
app.use("/Flight", FlightRouter);          // flight search
app.use("/FlightSchedule", FlightScheduleRouter);
app.use("/api/passenger", PassengerRouter); // add passenger
app.use("/api/booking", BookingRouter); // ✅ MUST EXIST
app.use("/api/ticket", TicketRouter);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminFlightRoutes);
app.use("/api/admin", require("./routes/adminBookings"));
app.use("/api/admin", require("./routes/adminDashboard"));
app.use("/api", require("./routes/schedule"));
app.use("/api/hotels", require("./routes/hotels"));
app.use("/api/admin", require("./routes/adminHotels"));






// SERVER
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
