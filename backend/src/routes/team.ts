import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authenticate } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.use(authenticate);

// Get all team members for the agency
router.get('/', async (req, res) => {
  try {
    const user = req.user!;
    const agencyId = user.agencyId;

    const team = await prisma.user.findMany({
      where: { agencyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        lastSeen: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ team });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Invite a new team member
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = req.user!;

    if (user.role !== 'ADMIN' && user.role !== 'ACCOUNT_MANAGER') {
      return res.status(403).json({ error: 'Only admins can invite team members' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash('password123', 10);

    const newMember = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        agencyId: user.agencyId,
        status: 'active'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true
      }
    });

    res.status(201).json({ member: newMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
