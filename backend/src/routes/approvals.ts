import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { WorkflowEngine } from '../services/workflowEngine.js';

const router = express.Router();

router.use(authenticate);

// Submit a post for approval
router.post('/:postId/submit', async (req, res) => {
  try {
    const { postId } = req.params;
    const { notes } = req.body;
    const user = req.user!;

    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { campaign: { include: { client: true } } }
    });

    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Determine the required approval tier based on client tags
    const clientTags = post.campaign?.client?.industryTags
      ? JSON.parse(post.campaign.client.industryTags)
      : [];
    const targetRole = WorkflowEngine.routePost(post, clientTags);

    const newStatus = targetRole === 'LEGAL_REVIEWER' ? 'in_review_internal' : 'in_review_client';

    // Update post status
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { status: newStatus }
    });

    // Create an approval step record
    const step = await prisma.approvalStep.create({
      data: {
        postId,
        stepOrder: 1,
        approverRole: targetRole,
        status: 'pending',
        decisionComment: notes || null,
      }
    });

    res.json({ post: updatedPost, approval: step });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Review (Approve/Reject) a post
router.post('/:postId/review', async (req, res) => {
  try {
    const { postId } = req.params;
    const { action, comments } = req.body; // action: 'approve' | 'reject'
    const user = req.user!;

    const step = await prisma.approvalStep.findFirst({
      where: { postId, status: 'pending' },
      orderBy: { createdAt: 'desc' }
    });

    if (!step) {
      res.status(404).json({ error: 'No pending approval found for this post' });
      return;
    }

    if (action === 'approve') {
      await prisma.approvalStep.update({
        where: { id: step.id },
        data: {
          status: 'approved',
          approverUserId: user.userId,
          decisionComment: comments || null,
          decidedAt: new Date()
        }
      });

      await prisma.post.update({
        where: { id: postId },
        data: { status: 'approved' }
      });
    } else if (action === 'reject') {
      await prisma.approvalStep.update({
        where: { id: step.id },
        data: {
          status: 'rejected',
          approverUserId: user.userId,
          decisionComment: comments || null,
          decidedAt: new Date()
        }
      });

      await prisma.post.update({
        where: { id: postId },
        data: { status: 'needs_revision' }
      });
    } else {
      res.status(400).json({ error: 'Invalid action. Must be approve or reject.' });
      return;
    }

    res.json({ message: `Post ${action}d successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pending approvals for the current user
router.get('/pending', async (req, res) => {
  try {
    const user = req.user!;
    let whereClause: any = { status: 'pending' };

    if (user.role === 'CLIENT_STAKEHOLDER') {
      whereClause.approverRole = 'CLIENT_STAKEHOLDER';
    } else if (user.role === 'LEGAL_REVIEWER') {
      whereClause.approverRole = 'LEGAL_REVIEWER';
    }
    // Admins/Account Managers can see all pending

    const approvals = await prisma.approvalStep.findMany({
      where: whereClause,
      include: {
        post: {
          include: {
            author: { select: { name: true, avatar: true } },
            campaign: { include: { client: { select: { name: true } } } }
          }
        },
        approver: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map into shape frontend expects
    const mapped = approvals.map(a => ({
      id: a.id,
      status: a.status,
      tier: a.approverRole,
      notes: a.decisionComment,
      createdAt: a.createdAt,
      post: {
        id: a.post.id,
        title: a.post.title,
        content: a.post.content,
        author: a.post.author,
        workspace: { client: { name: a.post.campaign?.client?.name || 'Unassigned' } }
      },
      requestedBy: a.approver || { name: 'System' }
    }));

    res.json({ approvals: mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
