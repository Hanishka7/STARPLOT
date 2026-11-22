import { Router } from 'express';
import auth from '../middleware/auth.js';
import { Notification } from '../models/index.js';

const r = Router();
r.get('/', auth, async (req, res) =>
  res.json(await Notification.find({ user: req.userId }).sort({ createdAt: -1 }).limit(30)));
r.post('/read', auth, async (req, res) => {
  await Notification.updateMany({ user: req.userId }, { read: true });
  res.json({ ok: true });
});
export default r;