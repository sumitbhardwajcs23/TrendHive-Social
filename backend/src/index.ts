import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import clientRoutes from './routes/clients.js';
import postRoutes from './routes/posts.js';
import approvalRoutes from './routes/approvals.js';
import inboxRoutes from './routes/inbox.js';
import mediaRoutes from './routes/media.js';
import brandKitRoutes from './routes/brandKits.js';
import teamRoutes from './routes/team.js';
import analyticsRoutes from './routes/analytics.js';
import settingsRoutes from './routes/settings.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/brandKits', brandKitRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: process.env.NODE_ENV });
});

app.listen(config.port, () => {
  console.log(`🚀 TrendHive Social Backend running on port ${config.port}`);
});
