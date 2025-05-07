import bcrypt from "bcrypt";
import User from "../models/user.model";
import logger from "../utils/logger";

export const createAdmin = async (name: string, email: string, password: string) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        status: 400,
        data: "User with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true, // Admins may not need email verification
    });

    await newAdmin.save();
    return {
      status: 201,
      data: { message: "Admin created successfully", adminId: newAdmin._id },
    };
  } catch (err) {
    logger.error(`Error from login, error is ${err}`);
    return {
      status: 500,
      data: "Server error",
    };
  }
};
