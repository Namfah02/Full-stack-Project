import { Router } from "express";
import * as Bookings from "../models/bookings.js";
import auth from "../middleware/auth.js";
import * as Users from "../models/users.js"

const bookingController = Router();

//Create booking
bookingController.post("/", auth(["member"]), async (req, res) => {
    // Get the booking data out of the request
    const bookingData = req.body; 
    const authenticationKey = req.get("X-AUTH-KEY")
    const currentUser = await Users.getByAuthenticationKey(authenticationKey)

    // Implement request validation
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(bookingData.created_datetime)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid datetime format",
      });
    }

    if (currentUser.role !== "member") {
      return res.status(403).json({
        status: 403,
        message: "You do not have permission to create booking",
      });
    }

    // Check if the user already has a booking for this class
    const existingBooking = await Bookings.getByUserIdAndClassId(currentUser.id, bookingData.class_id);
    if (existingBooking) {
      return res.status(400).json({
        status: 400,
        message: "You already have a booking for this class",
      });
    }
    
    // Convert the booking data into an booking model object
    const booking = Bookings.newBooking(
      null,
      bookingData.created_datetime,
      bookingData.user_id,
      bookingData.class_id,

    );

    // Use the create model function to insert this booking into the database
    Bookings.create(booking)
      .then((booking) => {
        res.status(200).json({
          status: 200,
          message: "Created booking successfully",
          booking: booking,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          status: 500,
          message: "Failed to created booking",
        });
      });
  }
);

//Get all booking
bookingController.get("/", auth(["manager"]), async (req, res) => {
  const bookings = await Bookings.getAll();

  res.status(200).json({
    status: 200,
    message: "Get all bookings",
    bookings: bookings,
  });
});

//Get booking by ID
bookingController.get("/:id", (req, res) => {
  const bookingID = req.params.id;

  Bookings.getBookingByID(bookingID)
    .then((booking) => {
      res.status(200).json({
        status: 200,
        message: "Get booking by ID",
        booking: booking,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Failed to get booking by ID",
      });
    });
});

//Get booking by user id
bookingController.get("/user/:id", async (req, res) => {
  const userID = req.params.id;

  Bookings.getByUserID(userID)
  .then((bookings) => {
    res.status(200).json({
      status: 200,
      message: "Get all bookings by user ID",
      bookings: bookings,
    });
  })
  .catch((error) => {
    res.status(500).json({
      status: 500,
      message: "Failed to get booking by user ID",
    });
  });
});


bookingController.delete("/:id", auth(["member"]), async (req, res) => {
  const bookingID = req.params.id;
  const authenticationKey = req.get("X-AUTH-KEY");
  
  const currentUser = await Users.getByAuthenticationKey(authenticationKey);
  if (!currentUser) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorised",
    });
  }

  const booking = await Bookings.getBookingByID(bookingID);
  if (!booking) {
    return res.status(404).json({
      status: 404,
      message: "Booking not found",
    });
  }

  if (booking.user_id.toString() !== currentUser.id) {
    return res.status(403).json({
      status: 403,
      message: "You do not have permission to delete this booking",
    });
  }

  try {
    await Bookings.deleteByID(bookingID);
    res.status(200).json({
      status: 200,
      message: "Booking deleted",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to delete booking",
    });
  }
});

export default bookingController;
