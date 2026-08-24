
const chatToggle=document.getElementById("chat-toggle");
const chatPanel=document.getElementById("chat-panel");
const chatClose=document.getElementById("chat-close");
const chatMessages=document.getElementById("chat-messages");
const chatQuick=document.getElementById("chat-quick");
const chatForm=document.getElementById("chat-form");
const chatInput=document.getElementById("chat-input");

const FAQ=[
 {label:"Serviços",keys:["serviço","servicos","serviços"],reply:"A IMA Digitais Soluções trabalha com websites, identidade visual, design gráfico, catálogos digitais, marketing digital e vídeos publicitários."},
 {label:"Website",keys:["site","website","web"],reply:"Criamos websites modernos, responsivos e preparados para apresentar a sua empresa e receber pedidos de clientes."},
 {label:"Preço",keys:["preço","preco","quanto custa","valor"],reply:"O preço depende do projeto. Posso recolher os seus dados para a equipa preparar uma proposta personalizada."},
 {label:"Orçamento",keys:["orçamento","orcamento","proposta","contratar"],reply:"Claro. Diga o seu nome, empresa, serviço e objetivo. O pedido pode ser enviado para a equipa."},
 {label:"Trabalhar conosco",keys:["trabalhar","emprego","vaga","currículo","curriculo"],reply:"Para trabalhar conosco, procure a área Trabalhe Conosco no site e envie a sua candidatura e currículo."}
];

const state=JSON.parse(localStorage.getItem("imaChat")||'{"messages":[]}');

function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));}
function render(){chatMessages.innerHTML=state.messages.map(m=>`<div class="bubble ${m.who}">${esc(m.text)}</div>`).join("");chatMessages.scrollTop=chatMessages.scrollHeight;}
function add(text,who){state.messages.push({text,who});localStorage.setItem("imaChat",JSON.stringify(state));render();}
function reply(t){
  t=t.toLowerCase();
  const hit=FAQ.find(f=>f.keys.some(k=>t.includes(k)));
  if(hit)return hit.reply;
  if(/olá|ola|bom dia|boa tarde|boa noite/.test(t))return"Olá! 👋 Sou o assistente virtual da IMA Digitais Soluções. Posso ajudar com serviços, orçamento ou oportunidades de trabalho.";
  if(/whatsapp/.test(t))return"Também atendemos por WhatsApp, mas você pode deixar a sua mensagem no formulário do site.";
  return"Posso ajudar com Serviços, Website, Preço, Orçamento ou Trabalhar conosco. Escolha uma opção abaixo.";
}
function quick(){chatQuick.innerHTML=FAQ.map(f=>`<button type="button">${esc(f.label)}</button>`).join("");chatQuick.querySelectorAll("button").forEach((b,i)=>b.onclick=()=>{const q=FAQ[i].label;add(q,"user");setTimeout(()=>add(reply(q),"bot"),200);});}
chatToggle?.addEventListener("click",()=>{chatPanel.hidden=!chatPanel.hidden;if(!chatPanel.hidden){if(!state.messages.length)add("Olá! 👋 Sou o assistente virtual da IMA. Como posso ajudar?","bot");quick();chatInput.focus();}});
chatClose?.addEventListener("click",()=>chatPanel.hidden=true);
chatForm?.addEventListener("submit",e=>{e.preventDefault();const t=chatInput.value.trim();if(!t)return;add(t,"user");chatInput.value="";setTimeout(()=>add(reply(t),"bot"),200);});
render();quick();
