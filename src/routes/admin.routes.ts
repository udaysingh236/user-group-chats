import express, { Request, Response } from "express";
import { validateCreateAdmin } from "../validators/createAdminSchema";
import { createAdmin } from "../controllers/admin.controller";
const router = express.Router();

/**
 * @swagger
 * /api/admin/create:
 *   post:
 *     summary: Create a new admin user
 *     description: Only accessible by existing admin users. Creates a new admin account.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation or input error
 *       401:
 *         description: Unauthorized - invalid token
 *       403:
 *         description: Forbidden - not an admin
 *       500:
 *         description: Server error
 */
router.post("/create", validateCreateAdmin, async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const { data, status } = await createAdmin(name, email, password);
  res.status(status).send(data);
});

export default router;
