import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { requireRole, Roles } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res) => {
  res.json({ message: 'brandKits endpoint' });
});

export default router;
