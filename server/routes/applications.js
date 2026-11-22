import { Router } from 'express';
import auth from '../middleware/auth.js';
import { Application } from '../models/index.js';
import { runApply } from '../services/applyBot.js';

const r = Router();

r.get('/', auth, async (req, res) =>
  res.json(await Application.find({ user: req.userId }).sort({ createdAt: -1 })));

r.get('/stats', auth, async (req, res) => {
  const all = await Application.find({ user: req.userId });
  const count = (s) => all.filter((a) => a.status === s).length;
  res.json({
    total: all.length,
    done: count('submitted'),
    pending: count('pending') + count('needs_human'),
    needsHuman: count('needs_human'),
    failed: count('failed'),
  });
});

r.post('/', auth, async (req, res) => {
  try { new URL(req.body.jobUrl); } catch { return res.status(400).json({ error: 'Invalid URL' }); }
  const app = await Application.create({ user: req.userId, jobUrl: req.body.jobUrl });
  runApply(app._id); // runs in background
  res.json(app);
});

export default r;