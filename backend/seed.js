import mongoose from 'mongoose';
import Train from './model/train.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seats = [];
let number = 1;
for (let row = 1; row <= 12; row++) {
  let numSeatsInRow = row === 12 ? 3 : 7;
  for (let seat = 1; seat <= numSeatsInRow; seat++) {
    seats.push({
      number,
      row,
      isBooked: false,
    });
    number++;
  }
}

// Choose a random number of seats to mark as booked
const numBookedSeats = Math.floor(Math.random() * 3) + 6;

// Mark the seats as booked by shuffling the array and updating the isBooked property
for (let i = 0; i < numBookedSeats; i++) {
  const randomIndex = Math.floor(Math.random() * seats.length);
  seats[randomIndex].isBooked = true;
}

const coach = {
  seats,
};

const train = new Train({
  coach,
});

// Define a function to delete the data present in MongoDB
const deleteData = async () => {
  try {
    await Train.deleteMany({});
    console.log('Data deleted successfully');
  } catch (err) {
    console.error('Error deleting data', err);
  }
};

// Call the deleteData function before seeding new data
deleteData().then(async () => {
  try {
    await train.save();
    console.log('Train data seeded successfully');
  } catch (err) {
    console.error('Error seeding train data', err);
  } finally {
    mongoose.disconnect();
  }
});
