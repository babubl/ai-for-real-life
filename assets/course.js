/* Course page: missions, progress, schedule patterns, token game, progress card */
(function(){
  var A=window.AIRL,store=A.store,esc=A.esc;
  var boxes=[].slice.call(document.querySelectorAll('.miss input[type=checkbox]'));
  var routeItems=[].slice.call(document.querySelectorAll('#route li'));
  var saved=store.json('aiCourse',{});
  boxes.forEach(function(b){b.checked=!!saved[b.id]});
  var weekDone=function(w){return boxes.filter(function(b){return b.id.indexOf('m'+w+'-')===0&&b.checked}).length};

  var update=function(){
    var st={},n=0;boxes.forEach(function(b){if(b.checked){st[b.id]=1;n++}});store.set('aiCourse',JSON.stringify(st));
    document.getElementById('progText').textContent=n+' of '+boxes.length+' missions done';
    document.getElementById('progLine').style.width=(n/boxes.length*100)+'%';
    routeItems.forEach(function(li,i){var c=weekDone(i+1);li.classList.toggle('on',c>0);li.classList.toggle('done',c===5);var p=li.querySelector('.wp');if(p)p.textContent=c===5?'Complete':(c?c+' of 5 done':'')});
    card();setWa();
  };

  /* path from home quiz */
  var path=store.json('aiPath',[]);
  if(Array.isArray(path))path.forEach(function(n){var li=routeItems[n-1];if(li)li.classList.add('mine');var a=document.getElementById('week-'+n);if(a)a.classList.add('mine')});

  /* jump menu */
  var jump=document.getElementById('jump');
  jump.addEventListener('change',function(){var t=document.getElementById(jump.value);if(t){t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});history.replaceState(null,'','#'+jump.value)}});
  var secs=['schedule'].concat([1,2,3,4,5,6,7,8,9,10,11,12].map(function(i){return 'week-'+i}),['toolbox','finish']).map(function(id){return document.getElementById(id)}).filter(Boolean);
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)jump.value=e.target.id})},{rootMargin:'-30% 0px -60% 0px'});secs.forEach(function(s){io.observe(s)})}

  /* schedule patterns */
  var T={
    evening:{f:1,note:'',s:[['Mon','8:30–9:15 pm','Learn','Read the week\'s idea.'],['Wed','8:30–9:15 pm','Practise','Run the prompts and experiment.'],['Fri','8:30–9:00 pm','Checkpoint','Answer the question, write two lines in your AI diary.'],['Sat','7:00–9:00 am','Lab','The main build of the week.'],['Sun','8:00–8:20 pm','Show someone','Share one thing you made.']]},
    morning:{f:1,note:'',s:[['Mon','6:15–7:00 am','Learn','Read the week\'s idea.'],['Wed','6:15–7:00 am','Practise','Run the prompts and experiment.'],['Fri','6:15–6:45 am','Checkpoint','Answer the question, write in your diary.'],['Sat','7:00–8:30 am','Lab','The main build of the week.'],['Sun','7:30–7:50 am','Show someone','Share one thing you made.']]},
    weekend:{f:1,note:'Weekends only: do the Mon and Wed missions on Saturday morning, and the Sat missions on Sunday.',s:[['Sat','9:00–10:30 am','Learn and practise','The idea, then the prompts.'],['Sat','4:00–4:30 pm','Checkpoint','The question and your diary.'],['Sun','9:00–10:30 am','Lab','The main build.'],['Sun','8:00–8:20 pm','Show someone','Share one thing you made.']]},
    light:{f:2.5,note:'Light pace: each course week takes two to three calendar weeks. That\'s fine.',s:[['Mon','15 min','Read','One section of the week.'],['Sat','45 min','Do','One or two missions.']]}
  };
  var tmpl=document.getElementById('tmpl'),sd=document.getElementById('startDate'),slots=document.getElementById('slots');
  var fmt=function(d){return d.toLocaleDateString('en-IN',{day:'numeric',month:'short'})};
  var sched=function(){
    var k=tmpl.value;var t=T[k]||T.evening;store.set('aiTmpl',k);
    slots.innerHTML=t.s.map(function(x){return '<li><div class="t">'+esc(x[0])+'<small>'+esc(x[1])+'</small></div><div><b>'+esc(x[2])+'</b>'+esc(x[3])+'</div></li>'}).join('')+(t.note?'<li><div></div><div class="small muted">'+esc(t.note)+'</div></li>':'');
    var v=sd.value;if(!v)return;var s=new Date(v+'T00:00:00');if(isNaN(s))return;store.set('aiCourseStart',v);
    var span=Math.round(7*t.f);
    document.querySelectorAll('[data-d]').forEach(function(el){var w=+el.dataset.d;var a=new Date(s);a.setDate(a.getDate()+(w-1)*span);var e=new Date(a);e.setDate(e.getDate()+span-1);el.textContent=fmt(a)+' – '+fmt(e)});
    var end=new Date(s);end.setDate(end.getDate()+12*span-1);
    document.getElementById('endLine').textContent='At this pace you finish on '+end.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})+'.';
  };
  var st=store.get('aiTmpl');if(st&&T[st])tmpl.value=st;var ss=store.get('aiCourseStart');if(ss)sd.value=ss;
  tmpl.addEventListener('change',sched);sd.addEventListener('change',sched);sched();

  /* token game */
  var words=[['amazing',2.5],['delicious',2.2],['like home',1.7],['spicy',1.4],['better',1.1],['salty',0.4],['purple',-2.5]];
  var rows=document.getElementById('rows'),temp=document.getElementById('temp'),tval=document.getElementById('tval'),blank=document.getElementById('blank'),picked=-1;
  if(rows&&temp){
    var probs=function(){var T2=+temp.value;var ex=words.map(function(w){return Math.exp(w[1]/T2)});var sum=ex.reduce(function(a,b){return a+b},0);return ex.map(function(x){return x/sum})};
    var draw=function(){tval.textContent=(+temp.value).toFixed(1);var p=probs();
      rows.innerHTML=words.map(function(w,i){return '<div class="row'+(i===picked?' pick':'')+'"><span>'+esc(w[0])+'</span><span class="tr"><i style="width:'+(p[i]*100).toFixed(1)+'%"></i></span><span class="v">'+(p[i]*100).toFixed(p[i]<0.01?1:0)+'%</span></div>'}).join('')};
    temp.addEventListener('input',function(){picked=-1;blank.textContent='___';draw()});
    document.getElementById('pick').addEventListener('click',function(){var p=probs(),r=Math.random(),i=0;while(i<p.length-1&&r>p[i]){r-=p[i];i++}picked=i;blank.textContent=words[i][0];draw()});
    document.getElementById('reset').addEventListener('click',function(){picked=-1;blank.textContent='___';temp.value=1;draw()});
    blank.setAttribute('aria-live','polite');draw();
  }

  /* progress card */
  var cv=document.getElementById('fin'),cx=cv&&cv.getContext&&cv.getContext('2d'),nm=document.getElementById('finName');
  nm.value=store.get('aiName')||'';
  var fit=function(text,font,max,size){var s=size;do{cx.font=font.replace('{s}',s);if(cx.measureText(text).width<=max)break;s-=2}while(s>24);return s};
  function card(){
    if(!cx)return;
    var done=routeItems.map(function(li,i){return weekDone(i+1)});
    var n=boxes.filter(function(b){return b.checked}).length,full=done.filter(function(d){return d===5}).length;
    var agents=boxes.filter(function(b){return /^m(9|10|11)-[234]$/.test(b.id)&&b.checked}).length;
    var D='"Newsreader", Georgia, serif',S='"Mukta", "Segoe UI", sans-serif';
    cx.fillStyle='#16181D';cx.fillRect(0,0,1080,1080);
    cx.fillStyle='#F2A93B';cx.fillRect(80,96,56,4);
    cx.fillStyle='#B9BCC4';cx.font='600 34px '+S;cx.fillText('AI for Real Life',80,160);
    cx.fillStyle='#F2EFE9';cx.font='500 88px '+D;cx.fillText(full===12?'I finished the course.':'I’m learning AI.',80,270);
    var name=(nm.value||'').trim();
    if(name){var sz=fit(name,'500 {s}px '+D,920,64);cx.fillStyle='#8C97FF';cx.font='500 '+sz+'px '+D;cx.fillText(name,80,360)}
    var x0=110,x1=970,y=540,step=(x1-x0)/11;
    cx.lineWidth=6;cx.strokeStyle='#3A404B';cx.beginPath();cx.moveTo(x0,y);cx.lineTo(x1,y);cx.stroke();
    cx.strokeStyle='#8C97FF';cx.lineWidth=6;
    for(var i=0;i<11;i++){if(done[i]===5&&done[i+1]===5){cx.beginPath();cx.moveTo(x0+step*i,y);cx.lineTo(x0+step*(i+1),y);cx.stroke()}}
    done.forEach(function(d,i){var x=x0+step*i;cx.beginPath();cx.arc(x,y,20,0,Math.PI*2);cx.fillStyle=d===5?'#8C97FF':'#16181D';cx.fill();cx.lineWidth=6;cx.strokeStyle=d===5?'#8C97FF':(d>0?'#F2A93B':'#3A404B');cx.stroke();
      cx.fillStyle='#B9BCC4';cx.font='600 26px '+S;cx.textAlign='center';cx.fillText(String(i+1),x,y+64);cx.textAlign='left'});
    [[n+' / 60','missions done'],[full+' / 12','weeks complete'],[agents+' / 9','agents built']].forEach(function(s,i){var x=80+i*320;cx.fillStyle='#F2EFE9';cx.font='500 72px '+D;cx.fillText(s[0],x,760);cx.fillStyle='#B9BCC4';cx.font='400 30px '+S;cx.fillText(s[1],x,808)});
    cx.fillStyle='#B9BCC4';cx.font='400 30px '+S;cx.fillText('Free course · aiforreallife.in',80,980);
    cv.setAttribute('aria-label','Progress card: '+n+' of 60 missions, '+full+' of 12 weeks complete, '+agents+' of 9 agents built.');
  }
  nm.addEventListener('input',function(){store.set('aiName',nm.value);card()});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(card);
  document.getElementById('finDl').addEventListener('click',function(){try{var a=document.createElement('a');a.download='ai-for-real-life-progress.png';a.href=cv.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove()}catch(e){}});
  var wa=document.getElementById('finWa');
  function setWa(){var n=boxes.filter(function(b){return b.checked}).length;wa.href='https://wa.me/?text='+encodeURIComponent('I\'m learning AI with a free hands-on course: '+n+' of 60 missions done so far. Join me: '+A.SITE)}

  /* erase with a second tap to confirm */
  var clr=document.getElementById('clearAll'),armed=null;
  clr.addEventListener('click',function(){
    if(!armed){clr.textContent='Tap again to erase all ticks';clr.classList.add('armed');armed=setTimeout(function(){armed=null;clr.textContent='Erase my progress';clr.classList.remove('armed')},4000);return}
    clearTimeout(armed);armed=null;boxes.forEach(function(b){b.checked=false});update();clr.textContent='Progress erased';clr.classList.remove('armed');setTimeout(function(){clr.textContent='Erase my progress'},2000);
  });

  boxes.forEach(function(b){b.addEventListener('change',update)});
  update();
})();
