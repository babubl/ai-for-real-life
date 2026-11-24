/* Home page: path quiz, tracks, timer, news, invite. Edit the CONFIG block to update monthly content. */
(function(){
  var A=window.AIRL,store=A.store,esc=A.esc;

  /* ===== CONFIG: edit these to update the site ===== */
  var COMMUNITY_LINK=''; /* paste a WhatsApp or Telegram group invite link to show "Join the group" */
  var CHALLENGE='Make a 4-panel comic of a funny family moment with any AI image tool (ChatGPT, Gemini or Canva). Show it to your buddy by Sunday.';
  var NEWS=[
    {m:'November 2026',items:[
      'AI for Real Life launched: twelve lessons on how AI works, a 12-week hands-on course, six tracks, nine agent recipes and a Go deeper shelf on every topic.',
      'Video: Google Veo, OpenAI Sora and Kling lead on quality, and most now create sound with the picture.',
      'Agents: no-code builders such as Zapier, Make and n8n are the easiest way in. Most multi-step automations need a paid plan.',
      'India: if you claimed OpenAI\'s free year of ChatGPT Go when it was offered from November 2025, check your plan\'s renewal date.'
    ]}
  ];
  /* ================================================== */

  var W={1:'Set up your assistants',2:'How ChatGPT and Claude answer',3:'Talk to AI well',4:'AI in daily life',5:'Images and slides',6:'Video and voice',7:'AI at work',8:'Meet the agents',9:'Agents: mornings, inbox, money',10:'Agents: bills, meals, news',11:'Agents: tutor, documents, content',12:'Build and publish a website'};
  var T={
    student:{name:'Students',who:'School and college',weeks:[5,7,8,11,12],
      first:'Paste a chapter or your notes and ask: "Make a 10-question quiz from this, one question at a time, and explain any I get wrong."',
      build:['A study tutor that gives hints instead of answers','A class presentation in under an hour','A portfolio website, live on the internet'],
      tip:'Use AI to understand, not to copy. Then see the next steps for technical learners.',guide:['guides.html#next-steps','Next steps for technical learners']},
    pro:{name:'Working professionals',who:'Any job, any industry',weeks:[7,8,9,12],
      first:'Paste rough meeting notes and ask: "Turn this into decisions, action items with owners, and a 5-line summary email."',
      build:['An inbox helper that sorts mail and drafts replies','A morning briefing on your phone','A plan to win back hours from your weekly routine'],
      tip:'Check your company\'s AI policy before pasting any work data into a tool.',guide:['guides.html#jobs','AI and your job']},
    home:{name:'Parents and home-makers',who:'Running a home and family',weeks:[5,8,10,11],
      first:'Send a photo of your fridge and ask for three dinners in under 30 minutes, plus a shopping list.',
      build:['A weekly meal plan and grocery list','A reminder helper for bills, policies and school fees','A patient homework tutor for the children'],
      tip:'Read the family safety guide first, and share it with your parents.',guide:['safety.html','Family AI safety']},
    biz:{name:'Business owners',who:'Shops, services and freelancers',weeks:[5,7,8,9,10,12],
      first:'Ask: "Write WhatsApp Business catalogue descriptions for these 5 products: [list]. Short and friendly, with price, in English and Tamil."',
      build:['Product photos, posters and festival offers','An expense log built from your bank alerts','Replies to Google reviews and a simple web page'],
      tip:'Never let AI promise prices, delivery dates or discounts to customers without your check.',guide:['guides.html#shop','AI for your shop']},
    senior:{name:'Retired',who:'For people who are retired',weeks:[5,8,10,11],
      first:'Tap the microphone and ask aloud: "Plan a relaxed 2-day temple trip near my city with little walking." Then keep talking to change the plan.',
      build:['A helper that answers questions from your policy papers','A weekly news summary on topics you enjoy','Greetings and photo stories for the family'],
      tip:'Start with the family safety guide, and agree a family code word this week.',guide:['safety.html','Family AI safety']},
    creator:{name:'Creators',who:'YouTube, Instagram, writing',weeks:[5,6,8,11,12],
      first:'Give one idea and ask: "Give me 10 hooks for a 30-second reel on this, then turn the best one into a script with shots."',
      build:['A content helper that drafts in your voice for approval','A 30-second video with voiceover and captions','Thumbnails and a simple brand kit'],
      tip:'Label AI-generated content, and never clone anyone\'s voice or face without permission.',guide:['guides.html#indian-languages','AI in Indian languages']}
  };
  var Q1=[['student','Student'],['pro','Working professional'],['home','Parent or home-maker'],['biz','Business owner'],['senior','Retired'],['creator','Creator']];
  var Q2=[['work','Save time at work',[7,9]],['create','Create content',[5,6]],['home','Run my home better',[10]],['business','Grow my business',[7,9,12]],['career','Grow my career',[7,12]],['curious','Understand it',[]]];
  var Q3=[['1','About 1 hour',2.5,'Keep the Saturday slot and 15 minutes on Monday. One station every two to three weeks is fine.'],['3','2 to 3 hours',1.5,'Keep Monday, Wednesday and Saturday. One station every week or two.'],['5','4 to 5 hours',1,'Keep all five weekly slots. One station a week.']];

  var mk=function(id,name,list){document.getElementById(id).innerHTML=list.map(function(o,i){return '<input type="radio" name="'+name+'" id="'+name+i+'" value="'+o[0]+'"><label for="'+name+i+'">'+esc(o[1])+'</label>'}).join('')};
  mk('q1','who',Q1);mk('q2','want',Q2);mk('q3','time',Q3);
  var form=document.getElementById('quiz'),steps=[].slice.call(form.querySelectorAll('.q')),prog=document.getElementById('qProg'),back=document.getElementById('qBack'),restart=document.getElementById('qRestart');
  var body=document.getElementById('resultBody'),card=document.getElementById('result'),status=document.getElementById('qStatus');
  var val=function(n){var c=form.querySelector('input[name='+n+']:checked');return c?c.value:null};
  var step=0;
  var show=function(i){step=i;steps.forEach(function(s,k){s.hidden=k!==i});prog.textContent=i<3?'Question '+(i+1)+' of 3':'Your route is ready';back.hidden=i===0||i>2;restart.hidden=i<3};

  var route=function(w,g,t){
    var tr=T[w],extra=(Q2.filter(function(q){return q[0]===g})[0]||[0,0,[]])[2];
    var rest=[2].concat(tr.weeks,extra).filter(function(v,i,a){return a.indexOf(v)===i}).sort(function(a,b){return a-b});
    var items=[{h:'#first-win',t:'15-minute first win',s:'Today'},{h:'course.html#week-1',t:'Week 1 · '+W[1]},{h:'course.html#week-3',t:'Week 3 · '+W[3]},{h:'course.html#week-4',t:'Week 4 · '+W[4]},{h:'basics.html',t:'How AI works · 12 lessons',o:'recommended'}];
    rest.forEach(function(n){items.push({h:'course.html#week-'+n,t:'Week '+n+' · '+W[n]})});
    var tm=Q3.filter(function(q){return q[0]===t})[0];var total=Math.round((items.length-1+1)*tm[2]);
    return {tr:tr,items:items,tm:tm,total:total,weeks:[1,3,4].concat(rest)};
  };
  var example=function(){
    card.classList.add('example');
    body.innerHTML='<span class="ex-tag">Example</span><h3>Your route appears here</h3><p class="pace">Answer three questions to see your stations, your first win and a realistic weekly pace.</p><ol class="rail"><li><span>15-minute first win</span></li><li><span>Week 1 · '+W[1]+'</span></li><li><span>Week 3 · '+W[3]+'</span></li><li><span>How AI works</span></li><li><span>…and the weeks for your track</span></li></ol>';
  };
  var render=function(){
    var w=val('who'),g=val('want'),t=val('time');store.set('aiQuiz',JSON.stringify({w:w,g:g,t:t}));
    if(!w||!g||!t){example();return}
    var r=route(w,g,t);store.set('aiPath',JSON.stringify(r.weeks));card.classList.remove('example');
    body.innerHTML='<span class="ex-tag">Your route</span><h3>'+esc(r.tr.name)+'</h3><p class="pace">'+r.items.length+' stations · about '+r.total+' weeks at '+esc(r.tm[1].toLowerCase())+' a week</p>'+
      '<div class="win"><b>Your first win today:</b> '+esc(r.tr.first)+'</div>'+
      '<ol class="rail">'+r.items.map(function(it,i){return '<li class="'+(i===0?'now':'')+'"><a href="'+it.h+'">'+esc(it.t)+'</a>'+(it.o?'<small class="opt">'+it.o+'</small>':'')+'</li>'}).join('')+'</ol>'+
      '<p class="small"><b>Pace:</b> '+esc(r.tm[3])+'</p><p class="small"><b>Tip:</b> '+esc(r.tr.tip)+' <a href="'+r.tr.guide[0]+'">'+esc(r.tr.guide[1])+'</a></p>'+
      '<div class="btn-row" style="margin-top:20px"><a class="btn btn-primary" href="#first-win">Start with the first win</a><a class="btn btn-secondary" href="course.html#week-1">Open Week 1</a></div>';
    status.textContent='Your route: '+r.tr.name+', '+r.items.length+' stations, about '+r.total+' weeks.';
  };
  form.addEventListener('change',function(e){render();var i=steps.indexOf(e.target.closest('.q'));if(i>-1&&i===step){show(i<2?i+1:3)}});
  back.addEventListener('click',function(){show(Math.max(0,step-1))});
  restart.addEventListener('click',function(){form.reset();store.set('aiQuiz','{}');show(0);render();var f=form.querySelector('input');if(f)f.focus()});
  var saved=store.json('aiQuiz',{}),firstOpen=0;
  [['who',saved.w],['want',saved.g],['time',saved.t]].forEach(function(p,i){if(p[1]){var el=form.querySelector('input[name='+p[0]+'][value="'+p[1]+'"]');if(el){el.checked=true;firstOpen=i+1}}});
  show(Math.min(firstOpen,3));render();

  /* tracks */
  var tabs=document.getElementById('trackTabs'),panel=document.getElementById('trackPanel'),keys=Object.keys(T);
  tabs.innerHTML=keys.map(function(k,i){return '<button type="button" role="tab" id="tab-'+k+'" aria-controls="trackPanel" aria-selected="'+(i===0)+'" tabindex="'+(i===0?0:-1)+'" data-k="'+k+'">'+esc(T[k].name)+'</button>'}).join('');
  var pick=function(k,focus){var t=T[k];
    [].forEach.call(tabs.children,function(b){var on=b.dataset.k===k;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;if(on&&focus)b.focus()});
    panel.setAttribute('aria-labelledby','tab-'+k);
    var wk=[1,3,4].concat(t.weeks);
    panel.innerHTML='<div><h3>'+esc(t.name)+'</h3><p class="who">'+esc(t.who)+'</p><p class="first"><b>First win:</b> '+esc(t.first)+'</p><h4>You\'ll build</h4><ul>'+t.build.map(function(b){return '<li>'+esc(b)+'</li>'}).join('')+'</ul><p class="small muted">'+esc(t.tip)+'</p><a class="link-arrow" href="'+t.guide[0]+'">'+esc(t.guide[1])+'</a></div>'+
      '<div><h4>Focus weeks</h4><ul class="weeks">'+wk.map(function(n){return '<li><a href="course.html#week-'+n+'"><span>'+esc(W[n])+'</span><small>Week '+n+'</small></a></li>'}).join('')+'<li><a href="basics.html"><span>How AI works</span><small>12 lessons</small></a></li></ul></div>';
  };
  tabs.addEventListener('click',function(e){var b=e.target.closest('button');if(b)pick(b.dataset.k)});
  tabs.addEventListener('keydown',function(e){var i=keys.indexOf(document.activeElement.dataset.k);if(i<0)return;if(e.key==='ArrowRight'){e.preventDefault();pick(keys[(i+1)%keys.length],true)}if(e.key==='ArrowLeft'){e.preventDefault();pick(keys[(i+keys.length-1)%keys.length],true)}});
  pick(keys[0]);
  document.querySelectorAll('[data-track]').forEach(function(a){a.addEventListener('click',function(){pick(a.dataset.track)})});

  /* news, challenge, invite */
  document.getElementById('news').innerHTML=NEWS.map(function(n){return '<li><span class="m">'+esc(n.m)+'</span><ul>'+n.items.map(function(i){return '<li>'+esc(i)+'</li>'}).join('')+'</ul></li>'}).join('');
  document.getElementById('challenge').textContent=CHALLENGE;
  var invite='I\'m learning AI with a free, practical course. Want to be my learning buddy? We do one step a week together: '+A.SITE;
  document.getElementById('invite').href='https://wa.me/?text='+encodeURIComponent(invite);
  var ci=document.getElementById('copyInvite');
  ci.addEventListener('click',function(){var d=function(m){ci.textContent=m;setTimeout(function(){ci.textContent='Copy invite'},1800)};if(navigator.clipboard){navigator.clipboard.writeText(invite).then(function(){d('Copied')},function(){d('Copy failed')})}else d('Copy failed')});
  if(COMMUNITY_LINK){var g=document.getElementById('group');g.href=COMMUNITY_LINK;g.hidden=false}

  /* timer */
  var left=900,tick=null,clock=document.getElementById('clock'),done=document.getElementById('tDone'),ts=document.getElementById('tStart');
  var paint=function(){clock.textContent=String(Math.floor(left/60)).padStart(2,'0')+':'+String(left%60).padStart(2,'0')};
  ts.addEventListener('click',function(){
    if(tick){clearInterval(tick);tick=null;ts.textContent='Resume';return}
    ts.textContent='Pause';done.textContent='';
    tick=setInterval(function(){left--;paint();if(left<=0){clearInterval(tick);tick=null;left=900;paint();ts.textContent='Start timer';done.textContent='Time. What surprised you? Note one line, then take the quiz for your full route.'}},1000);
  });
  document.getElementById('tReset').addEventListener('click',function(){clearInterval(tick);tick=null;left=900;paint();ts.textContent='Start timer';done.textContent=''});
})();
