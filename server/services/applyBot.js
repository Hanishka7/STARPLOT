import { chromium } from 'playwright';
import path from 'path';
import { Application, Profile, User, Notification } from '../models/index.js';
import { decrypt } from '../utils/crypto.js';

// Things only a human can do
const BLOCKERS = /captcha|live photo|selfie|webcam|take a photo|face verification|\botp\b|one[- ]time (password|code)/i;

// Save result + send in-app notification
async function finish(app, status, note) {
  app.status = status;
  app.note = note;
  await app.save();

  const msg = {
    submitted: `✅ Your job has been applied: ${app.jobUrl}`,
    needs_human: `⏳ Registration still pending, human action needed: ${note}\n${app.jobUrl}`,
    failed: `❌ StarBot couldn't apply: ${note}\n${app.jobUrl}`,
  }[status];

  await Notification.create({ user: app.user, message: msg, type: status });
}

// Free keyword-based matching: form field label -> profile value
function mapFields(fields, p, secrets) {
  const out = {};
  const [first, ...rest] = (p.fullName || '').trim().split(' ');

  const rules = [
    [/first\s*name/, first],
    [/(last|sur)\s*name/, rest.join(' ')],
    [/full\s*name|^name|your name|candidate name/, p.fullName],
    [/e-?mail/, p.email],
    [/phone|mobile|contact\s*(no|number)|whatsapp/, p.phone],
    [/address|city|location/, p.address],
    [/github/, p.links?.github],
    [/linkedin/, p.links?.linkedin],
    [/leetcode/, p.links?.leetcode],
    [/hackerrank/, p.links?.hackerrank],
    [/portfolio|website|personal url/, p.links?.portfolio],
    [/aadhaar|aadhar/, secrets.aadhaar],
    [/\bpan\b/, secrets.pan],
    [/passport/, secrets.passport],
    [/voter/, secrets.voterId],
    [/education|college|university|degree|qualification/, p.education],
    [/skills|technologies/, p.skills],
  ];

  for (const f of fields) {
    if (f.type === 'file') { out[f.id] = 'RESUME'; continue; }
    const text = (f.label || '').toLowerCase();
    const hit = rules.find(([re, val]) => val && re.test(text));
    if (hit) out[f.id] = hit[1];
  }
  return out;
}

// Read all fillable form fields from the page
const scanForm = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('input,select,textarea')]
      .filter((e) => !['hidden', 'submit', 'button', 'search'].includes(e.type))
      .map((e, i) => {
        e.setAttribute('data-sp', i);
        const label =
          e.labels?.[0]?.innerText || e.getAttribute('aria-label') || e.placeholder || e.name || '';
        return {
          id: i,
          tag: e.tagName.toLowerCase(),
          type: e.type,
          label: label.trim(),
          required: e.required || e.getAttribute('aria-required') === 'true',
        };
      })
  );

export async function runApply(appId) {
  const app = await Application.findById(appId);
  if (!app) return;

  const profile = (await Profile.findOne({ user: app.user }))?.toObject();
  const user = await User.findById(app.user);
  if (!profile) return finish(app, 'failed', 'Complete your profile first.');

  // Decrypt ID numbers locally (never sent anywhere)
  const secrets = {};
  for (const k of ['aadhaar', 'pan', 'passport', 'voterId']) {
    if (profile[k]) {
      try { secrets[k] = decrypt(profile[k]); } catch { /* ignore bad value */ }
    }
  }

  const data = {
    email: user.email,
    fullName: profile.fullName,
    phone: profile.phone,
    address: profile.address,
    education: profile.education,
    skills: profile.skills,
    links: profile.links || {},
  };

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(app.jobUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500);

    // 1. Human-only checks
    const blocked =
      (await page.locator('iframe[src*="captcha"], iframe[src*="recaptcha"], .g-recaptcha, .h-captcha').count()) ||
      (await page.locator('input[capture], video').count()) ||
      BLOCKERS.test(await page.innerText('body'));
    if (blocked) return finish(app, 'needs_human', 'CAPTCHA / live photo / OTP verification required.');

    // 2. Read the form (if it's a listing page, try clicking "Apply" first)
    let fields = await scanForm(page);
    if (fields.length < 2) {
      const applyBtn = page.locator('a:has-text("Apply"), button:has-text("Apply")').first();
      if (await applyBtn.count()) {
        await applyBtn.click().catch(() => {});
        await page.waitForTimeout(3500);
        fields = await scanForm(page);
      }
    }
    if (fields.length < 2)
      return finish(app, 'needs_human', 'No application form found (login required or multi-step page).');

    // 3. Map profile -> fields
    const mapping = mapFields(fields, data, secrets);

    // 4. Required fields we can't answer -> human needed
    const missing = fields.filter(
      (f) => f.required && f.type !== 'checkbox' && f.type !== 'radio' && mapping[f.id] == null
    );
    if (missing.length)
      return finish(
        app,
        'needs_human',
        `Needs your answer for: ${missing.map((m) => m.label || 'unnamed field').slice(0, 5).join(', ')}`
      );

    // 5. Fill the form
    for (const f of fields) {
      const el = page.locator(`[data-sp="${f.id}"]`);
      const v = mapping[f.id];

      if (f.type === 'checkbox') {
        if (f.required) await el.check().catch(() => {});
        continue;
      }
      if (v == null) continue;

      if (f.type === 'file') {
        if (profile.resumePath) await el.setInputFiles(path.resolve(profile.resumePath)).catch(() => {});
      } else if (f.tag === 'select') {
        await el.selectOption({ label: String(v) }).catch(() => {});
      } else {
        await el.fill(String(v)).catch(() => {});
      }
    }

    // 6. Submit
    const submit = page
      .locator('button[type=submit], input[type=submit], button:has-text("Submit"), button:has-text("Apply")')
      .first();
    if (!(await submit.count())) return finish(app, 'needs_human', 'Could not find the submit button.');
    await submit.click();
    await page.waitForTimeout(4000);

    // 7. Verify
    const after = await page.innerText('body');
    if (/thank you|application (received|submitted)|successfully (applied|submitted)/i.test(after))
      return finish(app, 'submitted', 'Applied successfully.');

    return finish(app, 'needs_human', 'Submitted but could not confirm. Please verify manually.');
  } catch (e) {
    return finish(app, 'failed', String(e.message).slice(0, 200));
  } finally {
    await browser.close();
  }
}