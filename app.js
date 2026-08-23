import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "A enviar...";
  try {
    await addDoc(collection(db, "messages"), {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      company: document.getElementById("company").value.trim(),
      service: document.getElementById("service").value,
      message: document.getElementById("message").value.trim(),
      createdAt: serverTimestamp(),
      status: "new"
    });
    form.reset();
    status.textContent = "Mensagem enviada com sucesso. Obrigado!";
  } catch (err) {
    console.error(err);
    status.textContent = "Não foi possível enviar. Verifique a configuração do Firebase.";
  }
});
