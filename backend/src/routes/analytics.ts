import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

// Get dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const user = req.user!;
    const agencyId = user.agencyId;

    const activeClients = await prisma.client.count({
      where: { agencyId }
    });

    const postsScheduled = await prisma.post.count({
      where: {
        author: { agencyId },
        status: { in: ['approved', 'published'] },
        scheduledTime: { not: null }
      }
    });

    const pendingApprovals = await prisma.approvalStep.count({
      where: {
        post: { author: { agencyId } },
        status: 'pending'
      }
    });

    // Recent activity
    const latestPosts = await prisma.post.findMany({
      where: { author: { agencyId } },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { campaign: { include: { client: true } } }
    });

    const latestApprovalSteps = await prisma.approvalStep.findMany({
      where: { post: { author: { agencyId } } },
      orderBy: { createdAt: 'desc' },
      take: 4,
      include: { post: { include: { campaign: { include: { client: true } } } }, approver: true }
    });

    const activities: any[] = [];
    latestPosts.forEach(post => {
      activities.push({
        type: 'post_created',
        text: `New post "${post.title}" created${post.campaign?.client?.name ? ` for ${post.campaign.client.name}` : ''}`,
        time: post.createdAt,
        timestamp: new Date(post.createdAt).getTime()
      });
    });

    latestApprovalSteps.forEach(step => {
      if (step.status === 'approved') {
        activities.push({
          type: 'approval',
          text: `Post approved${step.approver?.name ? ` by ${step.approver.name}` : ''}`,
          time: step.decidedAt || step.createdAt,
          timestamp: new Date(step.decidedAt || step.createdAt).getTime()
        });
      } else if (step.status === 'rejected') {
        activities.push({
          type: 'rejection',
          text: `Post needs revision${step.approver?.name ? ` (${step.approver.name})` : ''}`,
          time: step.decidedAt || step.createdAt,
          timestamp: new Date(step.decidedAt || step.createdAt).getTime()
        });
      } else {
        activities.push({
          type: 'pending_approval',
          text: `Approval requested for "${step.post?.title || 'Post'}"`,
          time: step.createdAt,
          timestamp: new Date(step.createdAt).getTime()
        });
      }
    });

    activities.sort((a, b) => b.timestamp - a.timestamp);
    const recentActivity = activities.slice(0, 4).map(a => {
      const diffMs = Date.now() - a.timestamp;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);
      let timeStr = 'just now';
      if (diffDays > 0) timeStr = `${diffDays}d ago`;
      else if (diffHrs > 0) timeStr = `${diffHrs}h ago`;
      else if (diffMins > 0) timeStr = `${diffMins}m ago`;

      return { text: a.text, time: timeStr };
    });

    res.json({
      stats: {
        activeClients,
        postsScheduled,
        pendingApprovals,
        engagementRate: '4.8%'
      },
      recentActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
