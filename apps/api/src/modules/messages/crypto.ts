import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { messageEncKey } from '../../config/env.js';

/**
 * AES-256-GCM at rest for contact message bodies. Per-row random IV;
 * the 16-byte auth tag is appended to the ciphertext. The key lives in
 * the environment — a database dump alone reveals nothing.
 */
export function encryptBody(plaintext: string): { enc: Buffer; iv: Buffer } {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', messageEncKey, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return { enc, iv };
}

export function decryptBody(enc: Buffer, iv: Buffer): string {
  const tag = enc.subarray(enc.length - 16);
  const data = enc.subarray(0, enc.length - 16);
  const decipher = createDecipheriv('aes-256-gcm', messageEncKey, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

/** Daily-salted IP hash: abuse forensics without storing raw IPs. */
export function hashIp(ip: string | undefined): string | null {
  if (!ip) return null;
  const daySalt = new Date().toISOString().slice(0, 10);
  return createHash('sha256').update(`${ip}:${daySalt}`).digest('hex');
}
