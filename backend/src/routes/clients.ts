import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Get all clients for the agency
router.get('/', async (req, res) => {
  try {
    const user = req.user!;
    const whereClause: any = { agencyId: user.agencyId };

    const clients = await prisma.client.findMany({
      where: whereClause,
      include: {
        workspace: true,
      },
      orderBy: { name: 'asc' }
    });

    // Map into shape frontend expects (_count.workspaces, workspaces array)
    const mapped = clients.map(c => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
      retainerValue: c.retainerValue,
      industryTags: c.industryTags,
      status: c.status,
      workspaces: c.workspace ? [c.workspace] : [],
      _count: { workspaces: c.workspace ? 1 : 0 },
    }));

    res.json({ clients: mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new client (Admin & Account Manager only)
router.post('/', requireRole(['ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
  try {
    const { name, industry, retainerValue, industryTags } = req.body;
    const user = req.user!;

    const client = await prisma.client.create({
      data: {
        name,
        industry: industry || 'Other',
        retainerValue: retainerValue ? parseFloat(retainerValue) : 0,
        industryTags: industryTags ? JSON.stringify(industryTags) : null,
        agencyId: user.agencyId,
        workspace: {
          create: {}
        }
      },
      include: { workspace: true }
    });

    res.status(201).json({ client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single client details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const client = await prisma.client.findFirst({
      where: { 
        id,
        agencyId: user.agencyId 
      },
      include: {
        workspace: true,
      }
    });

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    res.json({ client });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
