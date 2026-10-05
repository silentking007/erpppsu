'use client';
import {useEffect,useRef,useState} from 'react';

const DEFAULT_IMAGE='/assets/profile-reference.jpg';
const empty={id:0,username:'',password:'',name:'',status:'Not On Roll (Backlog)',course:'ICA - BCA (Semester - 6)',enrollment:'',phone:'',dob:'',student_mobile:'',father:'',email:'',profile_image:DEFAULT_IMAGE,upcoming_jobs:0,applied_jobs:0};

export default function AdminPanel(){
 const [users,setUsers]=useState([]),[form,setForm]=useState(empty),[fees,setFees]=useState([]),[msg,setMsg]=useState(''),[loading,setLoading]=useState(true),[uploading,setUploading]=useState(false);
 const fileRef=useRef(null);
 async function load(){setLoading(true);const r=await fetch('/api/admin/users');const d=await r.json();if(r.ok){setUsers(d.users);if(form.id){const f=d.users.find(x=>x.id===form.id);if(f)setForm({...f,password:''})}}else setMsg(d.error||'Unable to load users.');setLoading(false)}
 useEffect(()=>{load()},[]);
 function set(k,v){setForm(x=>({...x,[k]:v}))}
 function setEnrollment(v){setForm(x=>({...x,enrollment:v,username:v}))}
 async function save(e){e.preventDefault();setMsg('');const payload={...form,username:(form.enrollment||form.username||'').trim(),enrollment:(form.enrollment||'').trim()};if(!payload.username||!payload.enrollment)return setMsg('Enrollment number is required.');const r=await fetch('/api/admin/users',{method:form.id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();setMsg(d.error||d.message||'Saved');if(r.ok){setForm({...empty});setFees([]);load()}}
 async function del(id){if(!confirm('Delete this user and all fee rows?'))return;const r=await fetch('/api/admin/users?id='+id,{method:'DELETE'});const d=await r.json();setMsg(d.error||d.message);load()}
 function edit(u){setForm({...u,password:''});setFees([]);window.scrollTo({top:0,behavior:'smooth'})}
 async function viewFees(id){const r=await fetch('/api/admin/fees?user_id='+id);const d=await r.json();setFees(d.fees||[]);setForm(x=>({...x,id}))}
 async function saveFees(){if(!form.id)return;const r=await fetch('/api/admin/fees',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({user_id:form.id,fees})});const d=await r.json();setMsg(d.error||d.message)}
 function clear(){setForm({...empty});setFees([]);setMsg('')}
 function resizeImage(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const max=500,scale=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.82))};img.onerror=reject;img.src=reader.result};reader.onerror=reject;reader.readAsDataURL(file)})}
 async function handleImage(e){const file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')){setMsg('Please select a JPG, PNG or WEBP image.');return}if(file.size>5*1024*1024){setMsg('Image must be smaller than 5 MB.');return}setUploading(true);setMsg('Preparing profile image…');try{const data=await resizeImage(file);set('profile_image',data);setMsg('Profile image ready. Click Save User to store it.')}catch{setMsg('Unable to process this image.')}finally{setUploading(false)}}
 return <div className="admin-wrap">
  <header><div><img src="/assets/ppsu-logo.jpg"/><strong>Main Admin Panel</strong></div><a href="/api/logout">Logout</a></header>
  <div className="admin-grid">
   <section className="admin-card user-editor-card">
    <div className="card-heading"><div><span className="eyebrow">STUDENT ACCOUNT</span><h2>{form.id?'Edit User':'Create User'}</h2><p>{form.id?'Update login credentials and student details.':'Create a student account that logs in with Enrollment Number + Password.'}</p></div>{form.id&&<span className="edit-badge">Editing</span>}</div>
    <form className="admin-form" onSubmit={save}>
      <div className="login-box">
       <div className="login-box-title">Student Login</div>
       <div className="form-grid two">
        <label><span>Enrollment Number <b>*</b></span><input placeholder="e.g. 22SS02CA022" value={form.enrollment||''} onChange={e=>setEnrollment(e.target.value)} required/><small>This is the ID the student will use to log in.</small></label>
        <label><span>Set Password {form.id&&<em>(leave blank to keep current)</em>} {!form.id&&<b>*</b>}</span><input placeholder="Student password" type="password" value={form.password||''} onChange={e=>set('password',e.target.value)} required={!form.id}/><small>Student logs in using this password.</small></label>
       </div>
      </div>
      <div className="form-section-title">Student Information</div>
      <div className="form-grid two">
       <label><span>Full Name <b>*</b></span><input placeholder="Full student name" value={form.name||''} onChange={e=>set('name',e.target.value)} required/></label>
       <label><span>Status</span><input placeholder="Not On Roll (Backlog)" value={form.status||''} onChange={e=>set('status',e.target.value)}/></label>
       <label className="full"><span>Course</span><input placeholder="ICA - BCA (Semester - 6)" value={form.course||''} onChange={e=>set('course',e.target.value)}/></label>
       <label><span>Phone</span><input placeholder="Phone number" value={form.phone||''} onChange={e=>set('phone',e.target.value)}/></label>
       <label><span>DOB</span><input placeholder="DD-MM-YYYY" value={form.dob||''} onChange={e=>set('dob',e.target.value)}/></label>
       <label><span>Student Mobile</span><input placeholder="Student mobile" value={form.student_mobile||''} onChange={e=>set('student_mobile',e.target.value)}/></label>
       <label><span>Father / Phone</span><input placeholder="Father name / phone" value={form.father||''} onChange={e=>set('father',e.target.value)}/></label>
       <label className="full"><span>Email</span><input type="email" placeholder="student@example.com" value={form.email||''} onChange={e=>set('email',e.target.value)}/></label>
      </div>
      <div className="form-section-title">Profile Photo</div>
      <div className="photo-upload">
       <div className="photo-preview"><img src={form.profile_image||DEFAULT_IMAGE} alt="Profile preview"/></div>
       <div className="photo-controls"><div><strong>Student profile image</strong><p>Upload JPG, PNG or WEBP. The image is automatically resized for the dashboard.</p></div><div className="upload-actions"><button type="button" className="secondary-btn" onClick={()=>fileRef.current?.click()} disabled={uploading}>{uploading?'Preparing…':'Choose Image'}</button>{form.profile_image&&form.profile_image!==DEFAULT_IMAGE&&<button type="button" className="text-btn" onClick={()=>set('profile_image',DEFAULT_IMAGE)}>Use Default</button>}</div><input ref={fileRef} className="hidden-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage}/></div>
      </div>
      <div className="form-grid two compact-fields">
       <label><span>Upcoming Jobs</span><input type="number" min="0" value={form.upcoming_jobs??0} onChange={e=>set('upcoming_jobs',e.target.value)}/></label>
       <label><span>Applied Jobs</span><input type="number" min="0" value={form.applied_jobs??0} onChange={e=>set('applied_jobs',e.target.value)}/></label>
      </div>
      <div className="actions"><button className="primary-btn">{form.id?'Update User':'Create User'}</button><button className="secondary-btn" type="button" onClick={clear}>Clear</button></div>
    </form>{msg&&<div className="admin-msg">{msg}</div>}
   </section>
   <section className="admin-card users-card"><div className="card-heading"><div><span className="eyebrow">ACCOUNT MANAGEMENT</span><h2>Users</h2><p>{users.length} student account{users.length===1?'':'s'} available.</p></div></div>{loading?<p>Loading…</p>:<div className="user-list">{users.map(u=><div className="user-row" key={u.id}><div className="user-main"><img src={u.profile_image||DEFAULT_IMAGE} alt=""/><div><b>{u.name}</b><small>Enrollment: {u.enrollment||'—'}</small><small>Login: Enrollment + password</small></div></div><div className="user-actions"><button onClick={()=>edit(u)}>Edit</button><button onClick={()=>viewFees(u.id)}>Fees</button><a href={'/dashboard?preview='+u.id} target="_blank" rel="noreferrer">Preview</a><button className="danger" onClick={()=>del(u.id)}>Delete</button></div></div>)}</div>}</section>
  </div>
  {form.id&&<section className="admin-card fee-editor"><div className="card-heading"><div><span className="eyebrow">FEE MANAGEMENT</span><h2>Fee rows — {form.name}</h2></div></div><div className="fee-admin-grid">{Array.from({length:7},(_,i)=>fees[i]||{semester:String(i+1),fees_collected:0,previously_paid:0,paid_amount:0,outstanding_amount:0,can_pay:0}).map((f,i)=><div key={i}><b>Semester {f.semester}</b><label>Fees to be collected<input value={f.fees_collected} onChange={e=>setFees(a=>{const n=[...a];n[i]={...f,fees_collected:e.target.value};return n})}/></label><label>Previously paid<input value={f.previously_paid} onChange={e=>setFees(a=>{const n=[...a];n[i]={...f,previously_paid:e.target.value};return n})}/></label><label>Paid amount<input value={f.paid_amount} onChange={e=>setFees(a=>{const n=[...a];n[i]={...f,paid_amount:e.target.value};return n})}/></label><label>Outstanding<input value={f.outstanding_amount} onChange={e=>setFees(a=>{const n=[...a];n[i]={...f,outstanding_amount:e.target.value};return n})}/></label><label className="pay-toggle"><input type="checkbox" checked={!!Number(f.can_pay)} onChange={e=>setFees(a=>{const n=[...a];n[i]={...f,can_pay:e.target.checked?1:0};return n})}/> Allow Pay Now</label></div>)}</div><button className="primary-btn fee-save" onClick={saveFees}>Save Fees</button></section>}
 </div>
}
