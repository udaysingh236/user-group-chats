import bcrypt from "bcrypt";
import User from "../models/user.model";
import logger from "./logger";

export const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

    const admin = new User({
      firstName: "Default",
      lastName: "Admin",
      email: process.env.ADMIN_EMAIL,
      country: "N/A",
      password: hashedPassword,
      isVerified: true,
      verificationToken: "www",
      role: "admin",
    });

    await admin.save();
    logger.info("✅ Default admin seeded");
  } else {
    logger.info("ℹ️ Admin already exists");
  }
};
