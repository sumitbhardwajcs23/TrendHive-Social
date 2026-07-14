import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get all assets for the agency
router.get('/', async (req, res) => {
  try {
    const user = req.user!;
    const agencyId = user.agencyId;

    const assets = await prisma.asset.findMany({
      where: {
        workspace: {
          client: {
            agencyId
          }
        }
      },
      include: {
        workspace: {
          select: { id: true, client: { select: { id: true, name: true } } }
        },
        campaign: {
          select: { id: true, name: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ assets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new asset (dummy upload)
router.post('/', async (req, res) => {
  try {
    const { name, type, url, workspaceId, tags } = req.body;
    const user = req.user!;

    // Validate workspace belongs to agency
    if (workspaceId) {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        include: { client: true }
      });
      if (!workspace || workspace.client.agencyId !== user.agencyId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } else {
      // Find a default workspace for the agency if none provided
      const client = await prisma.client.findFirst({
        where: { agencyId: user.agencyId },
        include: { workspace: true }
      });
      if (!client || !client.workspace) {
         return res.status(400).json({ error: 'No workspace available to upload to.' });
      }
      req.body.workspaceId = client.workspace.id;
    }

    const newAsset = await prisma.asset.create({
      data: {
        name,
        type,
        url: url || `https://source.unsplash.com/random/800x600?${type}`,
        size: '2.4 MB',
        tags: tags ? JSON.stringify(tags) : null,
        workspaceId: req.body.workspaceId,
        uploadedBy: user.name,
      },
      include: {
        workspace: {
          select: { id: true, client: { select: { id: true, name: true } } }
        }
      }
    });

    res.status(201).json({ asset: newAsset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
