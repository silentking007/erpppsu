export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from 'next/server';
import { db, ensureSchema } from '../../../../lib/db';
import { setSession, verifyPassword } from '../../../../lib/auth';
export async function POST(req){ try{await ensureSchema();const {username,password}=await req.json();const r=await db.execute({sql:'SELECT * FROM admins WHERE username=?',args:[String(username||'').trim()]});const a=r.rows[0];if(!a||!(await verifyPassword(password||'',a.password_hash)))return NextResponse.json({error:'Invalid admin credentials.'},{status:401});await setSession(a.id,'admin');return NextResponse.json({ok:true});}catch(e){console.error(e);return NextResponse.json({error:'Server/database error.'},{status:500});}}
