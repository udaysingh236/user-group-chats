import express, { Request, Response } from "express";
import { login, signUpUser, verifyEmail } from "../controllers/user.controller";
import { validateSignup } from "../validators/signupSchema";
import { validateLogin } from "../validators/loginSchema";

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User sign-up
 *     description: Register a new user and send an email verification link.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               country:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User successfully created and email verification sent.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post("/signup", validateSignup, async (req: Request, res: Response) => {
  const { firstName, lastName, email, country, password } = req.body;
  const { data, status } = await signUpUser(firstName, lastName, email, country, password);
  res.status(status).send(data);
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Login a User.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User successfully logged in.
 *       400:
 *         description: Bad request.
 *       500:
 *         description: Server error.
 */
router.post("/login", validateLogin, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { data, status } = await login(email, password);
  res.status(status).send(data);
});

/**
 * @swagger
 * /verify-email:
 *   get:
 *     summary: Verify user's email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     description: Verify the user's email by the token sent.
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid verification token.
 *       500:
 *         description: Server error.
 */
router.get("/verify-email", async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).json({ error: "missing token" });
  }
  const { data, status } = await verifyEmail(token);
  res.status(status).send(data);
});

export default router;
