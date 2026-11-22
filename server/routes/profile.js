import { Router } from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import { Profile } from '../models/index.js';
import { encrypt, decrypt } from '../utils/crypto.js';

const r = Router();
const upload = multer({ dest: 'uploads/' });
const SENSITIVE = ['aadhaar', 'pan', 'passport', 'voterId'];
const mask = (v) => { try { return `•••• ${decrypt(v).slice(-4)}`; } catch { return ''; } };

r.get('/', auth, async (req, res) => {
  const p = (await Profile.findOne({ user: req.userId }))?.toObject() || {};
  SENSITIVE.forEach((k) => { if (p[k]) p[k] = mask(p[k]); });
  res.json(p);
});

r.put('/', auth, upload.fields([
  { name: 'resume', maxCount: 1 }, { name: 'photo', maxCount: 1 }, { name: 'idImage', maxCount: 1 },
]), async (req, res) => {
  const b = req.body;
  const update = {
    fullName: b.fullName, phone: b.phone, address: b.address, education: b.education, skills: b.skills,
    links: { github: b.github, linkedin: b.linkedin, leetcode: b.leetcode, hackerrank: b.hackerrank, portfolio: b.portfolio },
  };
  SENSITIVE.forEach((k) => { if (b[k] && !b[k].includes('•')) update[k] = encrypt(b[k]); });
  if (req.files?.resume) update.resumePath = req.files.resume[0].path;
  if (req.files?.photo) update.photoPath = req.files.photo[0].path;
  if (req.files?.idImage) update.idImagePath = req.files.idImage[0].path;
  const p = await Profile.findOneAndUpdate({ user: req.userId }, update, { upsert: true, new: true });
  res.json({ ok: true, id: p._id });
});

export default r;