import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const signupSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  country: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
