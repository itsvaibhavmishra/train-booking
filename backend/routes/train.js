import express from "express";
import Train from "../model/train.js";
import Users from "../model/user.js";

const trainRouter = express.Router();

// Route for getting the train data
trainRouter.get("/", async (req, res) => {
  try {
    // Find the train with its coach and bookings data
    const train = await Train.findOne()
      .select("-__v")
      .populate("coach.seats", "-_id -__v")
      .populate("bookings", "-_id -__v");

    if (!train) {
      return res
        .status(404)
        .json({ status: "error", message: "Train not found" });
    }

    // Map the seats data to a simpler array of boolean values indicating whether the seat is booked or not
    const seats = train.coach.seats.map((seat) => seat.isBooked);

    // Send the train data along with the simplified seats data to the client
    res.status(200).json({ status: "success", train, seats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Route for allowing any user to book seats
trainRouter.post("/", async (req, res) => {
  try {
    // Extract user ID from request headers
    const userId = req.headers["user-id"];

    // Check if the user exists based on the extracted ID
    if (userId !== null || userId !== undefined) {
      const user = await Users.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ status: "error", message: "Please login first" });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Please login first" });
    }

    // Parse the requested number of seats from the client
    const numSeats = parseInt(req.body.numSeats);

    if (!numSeats || numSeats < 1 || numSeats > 7) {
      return res.status(400).json({
        status: "info",
        message: "Invalid number of seats requested",
      });
    }

    // Find the train with its coach and bookings data
    const train = await Train.findOne()
      .populate("coach.seats")
      .populate("bookings");

    if (!train) {
      return res
        .status(404)
        .json({ status: "error", message: "Train not found" });
    }

    // Find the available seats for the requested number of seats
    let availableSeats = findAvailableSeats(train.coach.seats, numSeats);

    if (!availableSeats) {
      return res
        .status(400)
        .json({ status: "info", message: "No seats available" });
    }

    // Mark the available seats as booked
    markSeatsAsBooked(train, availableSeats);

    // Create a new booking with the booked seat numbers
    const newBooking = new Train({
      coach: { seats: train.coach.seats },
      bookings: [{ seats: availableSeats }],
    });

    // Save the new booking to the database
    await newBooking.save();

    // Send the booked seat numbers to the client
    res.status(200).json({ status: "success", seats: availableSeats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Helper function to mark the booked seats as booked
function markSeatsAsBooked(train, bookedSeats) {
  const seats = train.coach.seats;
  for (let i = 0; i < seats.length; i++) {
    if (bookedSeats.includes(seats[i].number)) {
      seats[i].isBooked = true;
    }
  }
  train.markModified("coach.seats");
  return train.save();
}

// Helper function to find the available seats for a requested number of seats
function findAvailableSeats(seats, numSeats) {
  let availableSeats = [];
  let currentSequence = 0;
  let start = 0;

  for (let i = 0; i < seats.length; i++) {
    if (!seats[i].isBooked) {
      currentSequence++;

      if (currentSequence === 1) {
        start = i;
      }

      if (currentSequence === numSeats) {
        for (let j = start; j <= i; j++) {
          availableSeats.push(seats[j].number);
        }

        return availableSeats;
      }
    } else {
      availableSeats = [];
      currentSequence = 0;
    }
  }

  return null;
}

export default trainRouter;
