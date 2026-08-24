import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const app=initializeApp(firebaseConfig), auth=getAuth(app), db=getFirestore(app);
const $=id=>document.getElementById(id); const tabs=document.querySelectorAll('.tab'); const panels=document.querySelectorAll('.tab-panel');
function showTab(name){tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab===name)); panels.forEach(p=>p.classList.toggle('hidden',p.id!==`tab-${name}`));}
tabs.forEach(b=>b.onclick=()=>showTab(b.dataset.tab)); document.querySelectorAll('.shortcut').forEach(b=>b.onclick=()=>showTab(b.dataset.open));
$('loginBtn').onclick=async()=>{try{await signInWithEmailAndPassword(auth,$('loginEmail').value,$('loginPassword').value);$('loginStatus').textContent=''}catch(e){$('loginStatus').textContent='Email ou senha inválidos.'}}; $('logoutBtn').onclick=()=>signOut(auth);
let unsubMsg, unsubEmp;
onAuthStateChanged(auth,user=>{if(!user){$('loginBox').classList.remove('hidden');$('dashboard').classList.add('hidden');return}$('loginBox').classList.add('hidden');$('dashboard').classList.remove('hidden');loadAll()});
async function loadAll(){
  unsubMsg?.(); unsubEmp?.();
  const mq=query(collection(db,'messages'),orderBy('createdAt','desc')); unsubMsg=onSnapshot(mq,snap=>{const arr=snap.docs.map(d=>({id:d.id,...d.data()})); $('statMessages').textContent=arr.length; renderMessages(arr)});
  unsubEmp=onSnapshot(collection(db,'employees'),snap=>{const arr=snap.docs.map(d=>({id:d.id,...d.data()})); $('statEmployees').textContent=arr.filter(x=>x.status==='Ativo').length; renderEmployees(arr)});
  const [clients,projects]=await Promise.all([getDocs(collection(db,'clients')),getDocs(collection(db,'projects'))]); $('statClients').textContent=clients.size;$('statProjects').textContent=projects.size; renderClients(clients.docs.map(d=>({id:d.id,...d.data()})));renderProjects(projects.docs.map(d=>({id:d.id,...d.data()})));
}
function renderMessages(items){const term=($('messageSearch')?.value||'').toLowerCase();$('messages').innerHTML=items.filter(x=>`${x.name||''} ${x.email||''} ${x.message||''}`.toLowerCase().includes(term)).map(x=>`<article class="message"><div class="message-top"><strong>${esc(x.name)}</strong><small>${x.createdAt?.toDate?.().toLocaleString('pt-AO')||'agora'}</small></div><span>${esc(x.email)} ${x.company?`• ${esc(x.company)}`:''}</span><b>${esc(x.service)}</b><p>${esc(x.message)}</p></article>`).join('')||'<p>Nenhuma mensagem.</p>'}
$('messageSearch').oninput=()=>loadAll();
function renderEmployees(items){$('employeesTable').innerHTML=items.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.role)}</td><td>${esc(x.department)}</td><td><span class="pill ${x.status==='Ativo'?'active':'inactive'}">${esc(x.status)}</span></td><td>${x.status==='Ativo'?`<button class="btn danger fire" data-id="${x.id}">Inativar</button>`:'<small>Histórico</small>'}</td></tr>`).join('')||'<tr><td colspan="5">Nenhum funcionário.</td></tr>';document.querySelectorAll('.fire').forEach(b=>b.onclick=()=>fireEmployee(b.dataset.id))}
async function fireEmployee(id){if(!confirm('Inativar este funcionário e manter o histórico?'))return;await updateDoc(doc(db,'employees',id),{status:'Inativo',endDate:serverTimestamp()})}
function renderClients(items){$('clientsTable').innerHTML=items.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.company)}</td><td>${esc(x.email)}</td><td>${esc(x.phone)}</td><td>${esc(x.status||'Ativo')}</td></tr>`).join('')||'<tr><td colspan="5">Nenhum cliente.</td></tr>'}
function renderProjects(items){$('projectsTable').innerHTML=items.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.client)}</td><td>${esc(x.service)}</td><td>${esc(x.status||'Em andamento')}</td></tr>`).join('')||'<tr><td colspan="4">Nenhum projeto.</td></tr>'}
const modal=$('modal'), entityForm=$('entityForm'); $('closeModal').onclick=()=>modal.classList.add('hidden');
$('newEmployee').onclick=()=>openForm('employee');$('newClient').onclick=()=>openForm('client');$('newProject').onclick=()=>openForm('project');
function openForm(type){modal.classList.remove('hidden');$('modalTitle').textContent=type==='employee'?'Contratar funcionário':type==='client'?'Novo cliente':'Novo projeto';
 const cfg= type==='employee'?[['name','Nome completo'],['role','Função'],['department','Departamento'],['email','Email'],['phone','Telefone']]:type==='client'?[['name','Nome'],['company','Empresa'],['email','Email'],['phone','Telefone']]:[['name','Projeto'],['client','Cliente'],['service','Serviço'],['status','Estado']];
 entityForm.innerHTML=cfg.map(([k,l])=>`<label>${l}<input name="${k}" required></label>`).join('')+`<div class="full"><button class="btn primary" type="submit">Guardar</button></div>`;entityForm.onsubmit=async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(entityForm));if(type==='employee'){data.status='Ativo';data.startDate=serverTimestamp()}if(type==='client'){data.status='Ativo'}if(type==='project'){data.createdAt=serverTimestamp()}await addDoc(collection(db,type==='employee'?'employees':type==='client'?'clients':'projects'),data);modal.classList.add('hidden');loadAll()}}
$('saveLocation').onclick=()=>{$('locationStatus').textContent='Localização preparada. Para alterar o mapa, atualize o endereço no código do site.'};
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
