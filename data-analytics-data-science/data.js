(function(){
  const progress=document.getElementById('progress');
  const menu=document.getElementById('menu');
  const nav=document.querySelector('.nav');
  const header=document.getElementById('site-header');
  function update(){
    const h=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(h>0?(window.scrollY/h)*100:0)+'%';
    header.classList.toggle('scrolled',window.scrollY>20);
  }
  window.addEventListener('scroll',update,{passive:true}); update();
  if(menu){menu.addEventListener('click',()=>{const open=nav.classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));});}
  document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('menu-open')));
})();
