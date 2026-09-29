(function(){
  var nav=document.querySelector('.meta-nav');
  var menu=document.getElementById('meta-menu');
  var overlay=document.getElementById('enrol-overlay');
  var progress=document.getElementById('meta-progress');
  var form=document.getElementById('meta-enquiry');

  if(menu){menu.addEventListener('click',function(){var open=nav.classList.toggle('mobile-open');menu.setAttribute('aria-expanded',open?'true':'false');});}
  document.querySelectorAll('.meta-nav-links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('mobile-open');menu&&menu.setAttribute('aria-expanded','false');});});

  function openDrawer(){overlay.hidden=false;document.body.classList.add('drawer-open');var first=overlay.querySelector('input');setTimeout(function(){if(first) first.focus();},50);}
  function closeDrawer(){overlay.hidden=true;document.body.classList.remove('drawer-open');}
  document.querySelectorAll('[data-open-enrol]').forEach(function(el){el.addEventListener('click',openDrawer);});
  document.querySelectorAll('[data-close-enrol]').forEach(function(el){el.addEventListener('click',closeDrawer);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!overlay.hidden)closeDrawer();});

  function valid(el){var v=(el.value||'').trim(); if(!v){el.classList.add('invalid');return false;} if(el.type==='email'&&!/^\S+@\S+\.\S+$/.test(v)){el.classList.add('invalid');return false;} if(el.type==='tel'&&v.replace(/\D/g,'').length<7){el.classList.add('invalid');return false;} el.classList.remove('invalid');return true;}
  if(form){
    form.querySelectorAll('input:not([type=hidden]),select').forEach(function(el){el.addEventListener('input',function(){valid(el);});});
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var fields=[].slice.call(form.querySelectorAll('input:not([type=hidden]),select')); var bad=null;
      fields.forEach(function(el){if(!valid(el)&&!bad)bad=el;}); if(bad){bad.focus();return;}
      var btn=form.querySelector('button[type=submit]'); if(btn){btn.disabled=true;btn.textContent='Sending…';}
      fetch('https://formsubmit.co/ajax/af26ba6712e7d1bda9b2165add0922ab',{method:'POST',headers:{Accept:'application/json'},body:new FormData(form)})
      .then(function(r){if(!r.ok)throw new Error('request failed');return r.json();})
      .then(function(data){if(data.success!==true&&data.success!=='true')throw new Error('delivery failed');form.innerHTML='<div class="form-success"><strong>Thank you!</strong><span>We’ve received your details. Our team will share the current Meta Ads program information shortly.</span></div>';})
      .catch(function(){if(btn){btn.disabled=false;btn.textContent='Send My Details →';}var err=document.querySelector('.drawer-form-error');if(!err){err=document.createElement('p');err.className='form-error drawer-form-error';form.prepend(err);}err.textContent='Something went wrong. Please try again or contact us directly.';});
    });
  }

  function updateProgress(){var h=document.documentElement.scrollHeight-window.innerHeight;progress.style.transform='scaleX('+(h>0?window.scrollY/h:0)+')';}
  window.addEventListener('scroll',updateProgress,{passive:true});updateProgress();
})();
