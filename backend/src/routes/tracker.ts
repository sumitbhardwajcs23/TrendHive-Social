import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get tracker items for the current user's workspaces
router.get('/', authenticate, async (req: any, res: any) => {
  try {
    let allowedClientIds: string[] = [];

    if (req.user.role === 'CLIENT_STAKEHOLDER') {
      const userWorkspaces = await prisma.workspaceUser.findMany({
        where: { userId: req.user.id },
        include: { workspace: true }
      });
      allowedClientIds = userWorkspaces.map(uw => uw.workspace.clientId);
    } else {
      // If admin, they should use the /:clientId route. But we can return all if we want.
      return res.json({ trackerItems: [] });
    }

    if (allowedClientIds.length === 0) {
      return res.json({ trackerItems: [] });
    }

    const items = await prisma.contentTracker.findMany({
      where: { clientId: { in: allowedClientIds } },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ trackerItems: items });
  } catch (error) {
    console.error('Fetch own tracker items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tracker items for a specific client (Admin/Client accessible)
router.get('/:clientId', authenticate, async (req: any, res: any) => {
  try {
    const { clientId } = req.params;
    
    // Optional: authorization check (clients can only see their own)
    if (req.user.role === 'CLIENT_STAKEHOLDER') {
      // Find the client for this user's workspace
      const userWorkspaces = await prisma.workspaceUser.findMany({
        where: { userId: req.user.id },
        include: { workspace: true }
      });
      
      const allowedClientIds = userWorkspaces.map(uw => uw.workspace.clientId);
      if (!allowedClientIds.includes(clientId)) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const items = await prisma.contentTracker.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ trackerItems: items });
  } catch (error) {
    console.error('Fetch tracker items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a tracker item
router.post('/', authenticate, async (req: any, res: any) => {
  try {
    const { reelId, topicName, rawLink, driveLink, type, editor, hashtag, feedback, status, views, platformLinks, clientId } = req.body;
    
    // Block clients from creating rows
    if (req.user.role === 'CLIENT_STAKEHOLDER') {
      return res.status(403).json({ error: 'Clients cannot create tracker rows' });
    }

    const item = await prisma.contentTracker.create({
      data: {
        topicName,
        clientId,
        reelId,
        rawLink,
        driveLink,
        type,
        editor,
        hashtag,
        feedback,
        status,
        views: views ? parseInt(views.toString()) : 0,
        platformLinks: platformLinks ? JSON.stringify(platformLinks) : null,
      }
    });

    res.status(201).json({ trackerItem: item });
  } catch (error) {
    console.error('Create tracker item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a tracker item
router.put('/:id', authenticate, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { reelId, topicName, rawLink, driveLink, type, editor, hashtag, feedback, status, views, platformLinks } = req.body;
    
    // Find the item to check permissions
    const existing = await prisma.contentTracker.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Not found' });

    // Handle client updates (only feedback allowed)
    if (req.user.role === 'CLIENT_STAKEHOLDER') {
      const userWorkspaces = await prisma.workspaceUser.findMany({
        where: { userId: req.user.id },
        include: { workspace: true }
      });
      const allowedClientIds = userWorkspaces.map(uw => uw.workspace.clientId);
      if (!allowedClientIds.includes(existing.clientId)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const clientUpdate = await prisma.contentTracker.update({
        where: { id },
        data: {
          feedback: feedback !== undefined ? feedback : existing.feedback
        }
      });
      return res.json({ trackerItem: clientUpdate });
    }

    const item = await prisma.contentTracker.update({
      where: { id },
      data: {
        reelId,
        topicName,
        rawLink,
        driveLink,
        type,
        editor,
        hashtag,
        feedback,
        status,
        views: views !== undefined ? parseInt(views.toString()) : undefined,
        platformLinks: platformLinks !== undefined ? JSON.stringify(platformLinks) : undefined,
      }
    });

    res.json({ trackerItem: item });
  } catch (error) {
    console.error('Update tracker item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a tracker item
router.delete('/:id', authenticate, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    
    // Restrict deletion to non-clients or specific roles if desired
    if (req.user.role === 'CLIENT_STAKEHOLDER') {
      return res.status(403).json({ error: 'Clients cannot delete tracker rows' });
    }

    await prisma.contentTracker.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete tracker item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
