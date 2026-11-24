/* AI for Real Life: shared behaviour (header, menu, copy buttons, storage helpers) */
(function(){
  var SITE='https://aiforreallife.in/';
  var store={
    get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},
    set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}},
    json:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
  };
  var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
  window.AIRL={SITE:SITE,store:store,esc:esc};

  var head=document.querySelector('.site-head');
  if(head){var onScroll=function(){head.classList.toggle('scrolled',window.scrollY>8)};onScroll();window.addEventListener('scroll',onScroll,{passive:true})}

  var btn=document.querySelector('.menu-btn'),sheet=document.getElementById('menu');
  if(btn&&sheet){
    var close=function(){sheet.hidden=true;btn.setAttribute('aria-expanded','false');document.body.classList.remove('locked');btn.focus()};
    var open=function(){sheet.hidden=false;btn.setAttribute('aria-expanded','true');document.body.classList.add('locked');var f=sheet.querySelector('a');if(f)f.focus()};
    btn.addEventListener('click',function(){sheet.hidden?open():close()});
    sheet.addEventListener('click',function(e){if(e.target.closest('a'))close()});
    document.addEventListener('keydown',function(e){
      if(sheet.hidden)return;
      if(e.key==='Escape'){close();return}
      if(e.key==='Tab'){var els=[].slice.call(sheet.querySelectorAll('a,button'));if(!els.length)return;var first=els[0],last=els[els.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();btn.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();btn.focus()}}
    });
    window.addEventListener('resize',function(){if(window.innerWidth>920&&!sheet.hidden)close()});
  }

  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click',function(){
      var pre=b.parentElement.querySelector('pre');if(!pre)return;var t=pre.textContent;
      var done=function(msg){b.textContent=msg;setTimeout(function(){b.textContent='Copy'},1800)};
      var fallback=function(){try{var r=document.createRange();r.selectNodeContents(pre);var s=window.getSelection();s.removeAllRanges();s.addRange(r);done('Selected')}catch(e){done('Copy failed')}};
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){done('Copied')},fallback)}else fallback();
    });
  });

  /* label stacked table cells for small screens, once */
  document.querySelectorAll('table.stack').forEach(function(tb){
    var heads=[].map.call(tb.querySelectorAll('thead th'),function(th){return th.textContent});
    tb.querySelectorAll('tbody tr').forEach(function(tr){[].forEach.call(tr.children,function(td,i){if(!td.hasAttribute('data-l'))td.setAttribute('data-l',heads[i]||'')})});
  });
})();
