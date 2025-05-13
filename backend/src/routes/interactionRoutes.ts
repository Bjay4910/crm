import { Router } from 'express';
import { 
  create, 
  getById, 
  update, 
  remove, 
  getByCustomerId 
} from '../controllers/interactionController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Interactions
 *   description: Customer interaction management endpoints
 */

/**
 * @swagger
 * /api/interactions/customer/{customerId}:
 *   get:
 *     summary: Get all interactions for a specific customer
 *     description: Retrieve all interactions associated with a customer ID
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customer ID to get interactions for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of interactions to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of interactions to skip
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, type, createdAt]
 *           default: date
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: List of interactions for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     interactions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Interaction'
 *                     total:
 *                       type: integer
 *                       description: Total number of interactions for this customer
 *                       example: 25
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/customer/:customerId', getByCustomerId);

/**
 * @swagger
 * /api/interactions/{id}:
 *   get:
 *     summary: Get an interaction by ID
 *     description: Retrieve a specific interaction by its unique ID
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The interaction ID
 *     responses:
 *       200:
 *         description: Interaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     interaction:
 *                       $ref: '#/components/schemas/Interaction'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getById);

/**
 * @swagger
 * /api/interactions:
 *   post:
 *     summary: Create a new interaction
 *     description: Record a new interaction with a customer
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - type
 *               - details
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: The ID of the customer this interaction is with
 *               type:
 *                 type: string
 *                 enum: [call, email, meeting, note, other]
 *                 description: The type of interaction
 *               details:
 *                 type: string
 *                 description: Details or notes about the interaction
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the interaction (defaults to current time if not provided)
 *     responses:
 *       201:
 *         description: Interaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     interaction:
 *                       $ref: '#/components/schemas/Interaction'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: 'error'
 *               statusCode: 404
 *               message: 'Customer not found'
 */
router.post('/', create);

/**
 * @swagger
 * /api/interactions/{id}:
 *   put:
 *     summary: Update an interaction
 *     description: Modify an existing customer interaction
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The interaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: integer
 *                 description: The ID of the customer this interaction is with
 *               type:
 *                 type: string
 *                 enum: [call, email, meeting, note, other]
 *                 description: The type of interaction
 *               details:
 *                 type: string
 *                 description: Details or notes about the interaction
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time of the interaction
 *     responses:
 *       200:
 *         description: Interaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     interaction:
 *                       $ref: '#/components/schemas/Interaction'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.put('/:id', update);

/**
 * @swagger
 * /api/interactions/{id}:
 *   delete:
 *     summary: Delete an interaction
 *     description: Remove an interaction from the system
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The interaction ID
 *     responses:
 *       200:
 *         description: Interaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Interaction deleted successfully"
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.delete('/:id', remove);

export default router;