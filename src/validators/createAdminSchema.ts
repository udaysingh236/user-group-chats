import Joi from "joi";
import { Request, Response, NextFunction } from "express";

const createAdminSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const validateCreateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = createAdminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
