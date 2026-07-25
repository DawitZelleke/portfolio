import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { db, schema } from '../../db/client.js';
import { badRequest } from '../../lib/problem.js';
import { validate } from '../../middleware/validate.js';
import { audit } from '../audit/service.js';
import { encryptBody, hashIp } from '../messages/crypto.js';

export const contactRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { title: 'Too Many Requests', status: 429, detail: 'Too many messages. Try again in an hour.' },
});

const contactInput = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().max(160).optional(),
  body: z.string().min(10).max(4000),
  website: z.string().optional(), // honeypot
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string | undefined, ip: string | undefined): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true; // not configured (dev) — skip
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success;
}

async function relayEmail(input: { name: string; email: string; subject?: string; body: string }) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL) return; // dev: stored only
  const { Resend } = await import('resend');
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'Portfolio <onboarding@resend.dev>',
    to: env.CONTACT_TO_EMAIL,
    replyTo: input.email,
    subject: `[Portfolio] ${input.subject ?? 'New message'} — ${input.name}`,
    text: `From: ${input.name} <${input.email}>\n\n${input.body}`,
  });
}

contactRouter.post('/', contactLimiter, validate('body', contactInput), async (req, res, next) => {
  try {
    const input = req.body as z.infer<typeof contactInput>;

    // Honeypot: real users never see the field; bots fill it. Answer 202
    // as if accepted — don't teach the bot which trap it hit.
    if (input.website) {
      await audit({ action: 'contact.honeypot', ip: req.ip });
      return res.status(202).json({ ok: true });
    }

    if (!(await verifyTurnstile(input.turnstileToken, req.ip))) {
      return next(badRequest('Verification failed. Refresh the page and try again.'));
    }

    const { enc, iv } = encryptBody(input.body);
    const [row] = await db
      .insert(schema.messages)
      .values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        bodyEnc: enc,
        bodyIv: iv,
        ipHash: hashIp(req.ip),
      })
      .returning({ id: schema.messages.id });

    await audit({
      action: 'contact.received',
      entityType: 'message',
      entityId: row!.id,
      ip: req.ip,
    });

    // Relay after storing: a mail-provider outage must not lose messages.
    relayEmail(input).catch((err) => console.error('contact relay failed', err));

    res.status(202).json({ ok: true });
  } catch (err) {
    next(err);
  }
});
