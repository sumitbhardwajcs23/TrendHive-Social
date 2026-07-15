import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

router.use(authenticate);

// Get assigned workspaces for a user
router.get('/assignments/:userId', requireRole(['ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
  try {
    const userId = req.params.userId as string;
    const user = req.user!;

    // Ensure the target user belongs to the same agency
    const targetUser = await prisma.user.findFirst({
      where: { id: userId, agencyId: user.agencyId }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const assignments = await prisma.workspaceUser.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            client: true
          }
        }
      }
    });

    res.json({ assignments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update assigned workspaces for a user
router.put('/assignments/:userId', requireRole(['ADMIN', 'ACCOUNT_MANAGER']), async (req, res) => {
  try {
    const userId = req.params.userId as string;
    const { workspaceIds } = req.body; // Array of workspace IDs
    const user = req.user!;

    // Ensure the target user belongs to the same agency
    const targetUser = await prisma.user.findFirst({
      where: { id: userId, agencyId: user.agencyId }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Use a transaction to delete existing assignments and create new ones
    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing assignments for this user
      await tx.workspaceUser.deleteMany({
        where: { userId }
      });

      // 2. Filter workspaceIds to ensure they belong to this agency
      const validWorkspaces = await tx.workspace.findMany({
        where: {
          id: { in: workspaceIds },
          client: {
            agencyId: user.agencyId
          }
        }
      });

      const validWorkspaceIds = validWorkspaces.map(w => w.id);

      // 3. Create new assignments
      if (validWorkspaceIds.length > 0) {
        await tx.workspaceUser.createMany({
          data: validWorkspaceIds.map(workspaceId => ({
            userId,
            workspaceId
          }))
        });
      }
    });

    res.json({ success: true, message: 'Assignments updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
