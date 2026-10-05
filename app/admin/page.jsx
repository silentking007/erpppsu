export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { redirect } from 'next/navigation'; import {getSession} from '../../lib/auth'; import AdminPanel from './panel'; import './admin.css';
export default async function Admin(){const s=await getSession();if(!s||s.role!=='admin')redirect('/admin/login');return <AdminPanel/>}
