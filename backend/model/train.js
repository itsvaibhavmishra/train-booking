import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  row: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
});

const coachSchema = new mongoose.Schema({
  seats: { type: [seatSchema], required: true },
});

const bookingSchema = new mongoose.Schema({
  seats: { type: [Number], required: true },
  createdAt: { type: Date, default: Date.now },
});

const trainSchema = new mongoose.Schema({
  coach: { type: coachSchema, required: true },
  bookings: { type: [bookingSchema], default: [] },
});

const Train = mongoose.model('Train', trainSchema);

export default Train;
