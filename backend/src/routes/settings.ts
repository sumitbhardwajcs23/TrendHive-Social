import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get agency settings
router.get('/', async (req, res) => {
  try {
    const user = req.user!;
    const agencyId = user.agencyId;

    const agency = await prisma.agency.findUnique({
      where: { id: agencyId },
    });

    if (!agency) {
      return res.status(404).json({ error: 'Agency not found' });
    }

    res.json({ agency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update agency settings
router.put('/', async (req, res) => {
  try {
    const { name, customDomain, planTier } = req.body;
    const user = req.user!;

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admins can update agency settings' });
    }

    const updatedAgency = await prisma.agency.update({
      where: { id: user.agencyId },
      data: {
        name,
        customDomain,
        planTier
      }
    });

    res.json({ agency: updatedAgency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
