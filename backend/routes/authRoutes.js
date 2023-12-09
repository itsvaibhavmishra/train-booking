import express from "express";
import bcrypt from "bcrypt";
import Users from "../model/user.js";
import { isDisposableEmail } from "../utils/checkDispose.js";

const authRouter = express.Router();

// Signup route
authRouter.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Full name validation
    if (fullName.length < 3 || fullName.length > 26) {
      return res.json({
        status: 400,
        message: "Length for full name should be between 3-26",
      });
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        status: 400,
        message: "Invalid email format",
      });
    }

    // Password Validation
    const passwordRegex =
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      return res.json({
        status: 400,
        message:
          "Password must be between 8-10 characters, including at least one uppercase, lowercase, number, and special character",
      });
    }

    // Check if email is disposable
    const isDisposable = await isDisposableEmail(email);

    if (isDisposable) {
      return res.json({
        status: 400,
        message: "Disposable emails are not allowed.",
      });
    }

    // Check if user with the same email already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.json({ status: 400, message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Users({
      fullName,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.json({ status: 201, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.json({ status: 500, message: "Internal Server Error" });
  }
});

// Login route
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ status: 404, message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ status: 401, message: "Invalid email or password" });
    }

    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    };

    res.json({ status: 200, message: "Login successful", user: userData });
  } catch (error) {
    console.error(error);
    res.json({ status: 500, message: "Internal Server Error" });
  }
});

export default authRouter;
