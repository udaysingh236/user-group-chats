import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { sendEmail } from "../utils/sendEmail";
import crypto from "crypto";
import logger from "../utils/logger";
import { loginSchema } from "../validators/loginSchema";
import { AuthPayload } from "../services/auth";

export const signUpUser = async (
  firstName: string,
  lastName: string,
  email: string,
  country: string,
  password: string
) => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        status: 400,
        data: "User already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      country,
      password: hashedPassword,
      verificationToken,
      role: "user",
    });

    await newUser.save();

    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      "Email Verification",
      `Click the link to verify your email: ${verificationLink}`
    );

    return {
      status: 201,
      data: "User registered, please check your email for verification",
    };
  } catch (err) {
    logger.error(`Error from signUpUser, error is ${err}`);
    return {
      status: 500,
      data: "Server error",
    };
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return {
        status: 400,
        data: "Invalid verification token",
      };
    }

    user.isVerified = true;
    user.verificationToken = ""; // Clear the token after verification
    await user.save();
    return {
      status: 200,
      data: "Email verified successfully",
    };
  } catch (err) {
    logger.error(`Error from verifyEmail, error is ${err}`);
    return {
      status: 500,
      data: "Server error",
    };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return {
        status: 401,
        data: "Invalid credentials",
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return {
        status: 401,
        data: "Invalid credentials",
      };
    }

    const payload: AuthPayload = { userId: user._id as string, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    return {
      status: 200,
      data: {
        message: "Login succesful",
        access_token: token,
      },
    };
  } catch (err) {
    logger.error(`Error from login, error is ${err}`);
    return {
      status: 500,
      data: "Server error",
    };
  }
};
