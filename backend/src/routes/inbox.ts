import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get all inbox items for the agency
router.get('/', async (req, res) => {
  try {
    const user = req.user!;
    const agencyId = user.agencyId;

    const inboxItems = await prisma.inboxItem.findMany({
      where: {
        client: {
          agencyId
        }
      },
      include: {
        client: {
          select: { id: true, name: true, logo: true }
        },
        lockOwner: {
          select: { id: true, name: true, avatar: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ inboxItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Resolve an inbox item
router.put('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    // Validate ownership
    const item = await prisma.inboxItem.findUnique({
      where: { id },
      include: { client: true }
    });

    if (!item) {
      return res.status(404).json({ error: 'Inbox item not found' });
    }

    if (item.client.agencyId !== user.agencyId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.inboxItem.update({
      where: { id },
      data: {
        status: 'resolved'
      },
      include: {
        client: { select: { id: true, name: true, logo: true } },
        lockOwner: { select: { id: true, name: true, avatar: true } }
      }
    });

    res.json({ item: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
