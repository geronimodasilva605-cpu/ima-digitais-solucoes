const nav=document.querySelector('.nav'), menu=document.querySelector('.menu');
menu?.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.getElementById('year').textContent=new Date().getFullYear();
function sendWhatsApp(e){
  e.preventDefault();
  const nome=document.getElementById('nome').value.trim();
  const empresa=document.getElementById('empresa').value.trim();
  const servico=document.getElementById('servico').value;
  const mensagem=document.getElementById('mensagem').value.trim();
  const text=`Olá IMA Digitais Soluções! Meu nome é ${nome}.${empresa?` Empresa: ${empresa}. `:" " }Tenho interesse em: ${servico}. ${mensagem}`;
  window.open('https://wa.me/244955005693?text='+encodeURIComponent(text),'_blank');
}
