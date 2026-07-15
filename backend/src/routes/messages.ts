import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const prisma = new PrismaClient();

// Get messages for a specific client
router.get('/:clientId', authenticate, async (req, res) => {
  try {
    const clientId = req.params.clientId as string;

    const messages = await prisma.clientMessage.findMany({
      where: { clientId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Send a message
router.post('/:clientId', authenticate, async (req, res) => {
  try {
    const clientId = req.params.clientId as string;
    const { content } = req.body;
    const user = (req as any).user;

    const message = await prisma.clientMessage.create({
      data: {
        content,
        clientId,
        senderId: user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
            avatar: true,
          }
        }
      }
    });

    res.json(message);
  } catch (error) {
    console.error('Failed to send message', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
