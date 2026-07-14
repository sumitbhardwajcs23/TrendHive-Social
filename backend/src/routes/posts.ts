import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { WorkflowEngine } from '../services/workflowEngine.js';
import { SentimentService } from '../services/sentimentService.js';

const router = express.Router();

router.use(authenticate);

// Get posts with filtering
router.get('/', async (req, res) => {
  try {
    const { status, platform } = req.query;
    const user = req.user!;

    let whereClause: any = {
      author: {
        agencyId: user.agencyId
      }
    };

    if (status) whereClause.status = status;
    if (platform) whereClause.platform = platform;

    // Role-based filtering constraints
    if (user.role === 'FREELANCER') {
      whereClause.authorId = user.userId;
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        campaign: { include: { client: { select: { id: true, name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map into shape frontend expects (workspace.client.name)
    const mapped = posts.map(p => ({
      id: p.id,
      title: p.title,
      content: p.content,
      status: p.status,
      platform: p.platform,
      scheduledFor: p.scheduledTime,
      author: p.author,
      workspace: p.campaign ? { client: { name: p.campaign.client.name } } : null,
      createdAt: p.createdAt,
    }));

    res.json({ posts: mapped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, content, platform, workspaceId, scheduledFor, internalNotes } = req.body;
    const user = req.user!;

    // Perform safety checks
    const bannedTerms = ['scam', 'guarantee', 'free money'];
    const foundTerms = WorkflowEngine.checkBannedTerms(content || '', bannedTerms);
    if (foundTerms.length > 0) {
      res.status(400).json({ error: `Content contains banned terms: ${foundTerms.join(', ')}` });
      return;
    }

    const sentiment = SentimentService.analyze(content || '');

    // Find a campaign for the workspace if provided
    let campaignId: string | undefined;
    if (workspaceId) {
      // Find or create a default campaign for this workspace
      let campaign = await prisma.campaign.findFirst({
        where: { workspaceId }
      });
      if (!campaign) {
        const workspace = await prisma.workspace.findUnique({
          where: { id: workspaceId },
          include: { client: true }
        });
        if (workspace) {
          campaign = await prisma.campaign.create({
            data: {
              name: 'Default Campaign',
              clientId: workspace.clientId,
              workspaceId: workspace.id,
            }
          });
        }
      }
      campaignId = campaign?.id;
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        platform,
        campaignId,
        scheduledTime: scheduledFor ? new Date(scheduledFor) : null,
        status: 'draft',
        authorId: user.userId,
        tags: JSON.stringify({ sentiment }),
      }
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Safety check if content is being updated
    if (updates.content) {
      const bannedTerms = ['scam', 'guarantee', 'free money'];
      const foundTerms = WorkflowEngine.checkBannedTerms(updates.content, bannedTerms);
      if (foundTerms.length > 0) {
        res.status(400).json({ error: `Content contains banned terms: ${foundTerms.join(', ')}` });
        return;
      }
    }

    // Only allow updating safe fields
    const safeUpdates: any = {};
    if (updates.title) safeUpdates.title = updates.title;
    if (updates.content) safeUpdates.content = updates.content;
    if (updates.status) safeUpdates.status = updates.status;
    if (updates.platform) safeUpdates.platform = updates.platform;
    if (updates.scheduledFor) safeUpdates.scheduledTime = new Date(updates.scheduledFor);

    const post = await prisma.post.update({
      where: { id },
      data: safeUpdates,
    });
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
