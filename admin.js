import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { getFirestore, collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const loginBox = document.getElementById("loginBox");
const dashboard = document.getElementById("dashboard");
const status = document.getElementById("loginStatus");
const messages = document.getElementById("messages");

document.getElementById("loginBtn")?.addEventListener("click", async () => {
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    status.textContent = "";
  } catch (e) {
    status.textContent = "Email ou senha inválidos.";
  }
});
document.getElementById("logoutBtn")?.addEventListener("click",()=>signOut(auth));

onAuthStateChanged(auth, user => {
  if (!user) {
    loginBox.classList.remove("hidden"); dashboard.classList.add("hidden"); return;
  }
  loginBox.classList.add("hidden"); dashboard.classList.remove("hidden");
  const q = query(collection(db,"messages"), orderBy("createdAt","desc"));
  onSnapshot(q, snap => {
    if (snap.empty) { messages.innerHTML = "<p>Nenhuma mensagem ainda.</p>"; return; }
    messages.innerHTML = snap.docs.map(d => {
      const x=d.data(); const date=x.createdAt?.toDate?.().toLocaleString("pt-AO") || "agora";
      return `<article class="message"><div><strong>${escapeHtml(x.name||"Sem nome")}</strong><span>${escapeHtml(x.email||"")}</span><span>${escapeHtml(x.company||"")}</span></div><small>${date}</small><b>${escapeHtml(x.service||"")}</b><p>${escapeHtml(x.message||"")}</p></article>`;
    }).join("");
  });
});
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));}
