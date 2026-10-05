import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const COOKIE = 'ppsu_session';
const secret = () => process.env.SESSION_SECRET || 'local-development-secret-change-me';

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}
function encode(obj) { return Buffer.from(JSON.stringify(obj)).toString('base64url'); }
function decode(value) { return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')); }

export function makeSession(id, role) {
  const payload = encode({ id, role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 });
  return `${payload}.${sign(payload)}`;
}
export function readSessionValue(value) {
  try {
    if (!value) return null;
    const [payload, signature] = value.split('.');
    if (!payload || !signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(sign(payload)))) return null;
    const data = decode(payload);
    if (data.exp < Date.now()) return null;
    return data;
  } catch { return null; }
}
export async function getSession() {
  const store = await cookies();
  return readSessionValue(store.get(COOKIE)?.value);
}
export async function setSession(id, role) {
  const store = await cookies();
  store.set(COOKIE, makeSession(id, role), { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/', maxAge:60*60*24*7 });
}
export async function clearSession() {
  const store = await cookies();
  store.set(COOKIE, '', { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/', maxAge:0 });
}
export async function requireRole(role) {
  const s = await getSession();
  if (!s || s.role !== role) return null;
  return s;
}
export async function hashPassword(password) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password, hash) { return bcrypt.compare(password, hash); }
