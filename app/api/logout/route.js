export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from 'next/server';
import { clearSession } from '../../../lib/auth';
export async function GET(req){ await clearSession(); return NextResponse.redirect(new URL('/', req.url)); }
