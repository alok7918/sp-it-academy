(function(){
  const menu=document.getElementById('menu');
  const nav=document.querySelector('.nav-links');
  if(menu && nav){
    menu.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      menu.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
    }));
  }
  const progress=document.getElementById('progress');
  if(progress){
    const update=()=>{const h=document.documentElement.scrollHeight-innerHeight; progress.style.width=(h>0?(scrollY/h)*100:0)+'%';};
    addEventListener('scroll',update,{passive:true}); update();
  }
})();
