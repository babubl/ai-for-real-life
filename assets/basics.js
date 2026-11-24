/* How AI works: lesson ticks, mango perceptron, neuron, quiz */
{
  const store=window.AIRL.store;
  const esc=window.AIRL.esc;

  /* lesson ticks */
  let got={};try{got=JSON.parse(store.get('aiSchool')||'{}')}catch(e){got={}}
  const ticks=[...document.querySelectorAll('input[data-l]')];
  const tocLinks=[...document.querySelectorAll('#lessonJump option[data-l]')];
  const paintToc=()=>{let c=0;ticks.forEach(t=>{const a=tocLinks[+t.dataset.l-1];if(t.checked)c++;if(a)a.textContent=a.dataset.t+(t.checked?' ✓':'')});const pt=document.getElementById('lessonProg');if(pt)pt.textContent=c+' of '+ticks.length+' lessons done';const pl=document.getElementById('lessonLine');if(pl)pl.style.width=(c/ticks.length*100)+'%'};
  ticks.forEach(t=>{t.checked=!!got[t.dataset.l];t.addEventListener('change',()=>{got[t.dataset.l]=t.checked?1:0;store.set('aiSchool',JSON.stringify(got));paintToc()})});
  paintToc();

  /* mango perceptron */
  let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
  const pts=[];for(let i=0;i<60;i++){const x=rnd(),y=rnd();const n=(rnd()-.5)*.06;pts.push({x,y,r:(x*0.9+y*1.1+n)>1.05?1:0})}
  let w1,w2,b,ep;
  const reset=()=>{w1=-0.4;w2=0.9;b=-0.2;ep=0};
  const pred=p=>(w1*p.x+w2*p.y+b)>0?1:0;
  const train=()=>{const lr=0.15;pts.forEach(p=>{const e=p.r-pred(p);if(e){w1+=lr*e*p.x;w2+=lr*e*p.y;b+=lr*e}});ep++};
  const svg=document.getElementById('msvg');
  const drawM=()=>{
    const W=svg.clientWidth,H=svg.clientHeight;if(!W||!H)return;
    const L=40,R=14,T=14,B=40,pw=W-L-R,ph=H-T-B;
    const X=v=>L+v*pw,Y=v=>T+(1-v)*ph;
    const segs=[];const add=(x,y)=>{if(x>=-1e-6&&x<=1+1e-6&&y>=-1e-6&&y<=1+1e-6)segs.push([x,y])};
    if(Math.abs(w2)>1e-9){add(0,-b/w2);add(1,-(b+w1)/w2)}
    if(Math.abs(w1)>1e-9){add(-b/w1,0);add(-(b+w2)/w1,1)}
    let line='';if(segs.length>=2){const [a,c]=[segs[0],segs.find(s=>Math.hypot(s[0]-segs[0][0],s[1]-segs[0][1])>1e-6)||segs[1]];line='<line x1="'+X(a[0])+'" y1="'+Y(a[1])+'" x2="'+X(c[0])+'" y2="'+Y(c[1])+'" stroke="var(--brand)" stroke-width="3" stroke-linecap="round" stroke-dasharray="10 7"/>'}
    let ok=0;const dots=pts.map(p=>{const right=pred(p)===p.r;if(right)ok++;return '<circle cx="'+X(p.x)+'" cy="'+Y(p.y)+'" r="7" fill="'+(p.r?'var(--marigold)':'var(--success)')+'"/>'+(right?'':'<circle cx="'+X(p.x)+'" cy="'+Y(p.y)+'" r="12" fill="none" stroke="var(--danger)" stroke-width="2.5"/>')}).join('');
    const short=W<360;
    svg.innerHTML='<rect x="'+L+'" y="'+T+'" width="'+pw+'" height="'+ph+'" fill="none" stroke="var(--line)"/>'+dots+line+
      '<text x="'+L+'" y="'+(H-12)+'">green</text><text x="'+(L+pw)+'" y="'+(H-12)+'" text-anchor="end">yellow</text><text x="'+(L+pw/2)+'" y="'+(H-12)+'" text-anchor="middle" style="font-weight:600;fill:var(--ink)">Colour</text>'+
      '<text transform="translate(16 '+(T+ph/2)+') rotate(-90)" text-anchor="middle" style="font-weight:600;fill:var(--ink)">Softness</text><text x="'+(L-6)+'" y="'+(T+12)+'" text-anchor="end">soft</text><text x="'+(L-6)+'" y="'+(T+ph)+'" text-anchor="end">hard</text>';
    document.getElementById('macc').textContent=Math.round(ok/pts.length*100)+'% right';
    document.getElementById('mep').textContent='round '+ep+(ok===pts.length?' · it learned the pattern':(ep>=15?' · close enough: a few mangoes are tricky':''));
  };
  reset();
  const mro=new ResizeObserver(drawM);mro.observe(svg);
  document.getElementById('mstep').addEventListener('click',()=>{train();drawM()});
  document.getElementById('m10').addEventListener('click',()=>{for(let i=0;i<10;i++)train();drawM()});
  document.getElementById('mreset').addEventListener('click',()=>{reset();drawM()});

  /* neuron */
  const g=id=>document.getElementById(id);
  const neuron=()=>{
    const rain=g('nRain').checked?1:0,t=+g('nTime').value,e=+g('nEnergy').value,wr=+g('wRain').value,wt=+g('wTime').value,we=+g('wEnergy').value,bias=-2.5;
    g('oTime').textContent=t;g('oEnergy').textContent=e;g('owRain').textContent=wr;g('owTime').textContent=wt.toFixed(2);g('owEnergy').textContent=we.toFixed(2);
    const z=rain*wr+t*wt+e*we+bias;const p=1/(1+Math.exp(-z));
    g('nSum').textContent='Sum = '+rain+'×'+wr+' + '+t+'×'+wt.toFixed(2)+' + '+e+'×'+we.toFixed(2)+' + bias '+bias+' = '+z.toFixed(2);
    g('nBar').style.width=(p*100).toFixed(0)+'%';g('nOut').textContent=Math.round(p*100)+'%';
    g('nDec').textContent=p>=0.5?'Go for the walk':'Stay home';
  };
  ['nRain','nTime','nEnergy','wRain','wTime','wEnergy'].forEach(id=>g(id).addEventListener('input',neuron));neuron();

  /* exam */
  const Q=[
    ['Which is the biggest circle, containing all the others?',['Machine learning','Artificial intelligence','Deep learning','Generative AI'],1,'AI is the umbrella; ML, deep learning and generative AI sit inside it.'],
    ['Machine learning means the computer…',['follows rules a programmer wrote','learns patterns from examples','searches Google for answers','copies human brains exactly'],1,'It learns from data instead of being given every rule.'],
    ['In a dataset of mangoes, "ripe / not ripe" is the…',['feature','label','weight','token'],1,'The label is the right answer attached to each example.'],
    ['Predicting next month\'s electricity bill amount is…',['classification','clustering','regression','reinforcement'],2,'Predicting a number is regression, a type of supervised learning.'],
    ['Grouping customers into types with no labels given is…',['supervised learning','unsupervised learning','reinforcement learning','fine-tuning'],1,'Finding groups on its own is unsupervised clustering.'],
    ['A model gets 99% on training data and 60% on new data. This is…',['overfitting','bias','hallucination','attention'],0,'It memorised instead of learning the general pattern.'],
    ['What does training actually change inside a model?',['Its code','Its weights','Its data','Its GPU'],1,'Learning means adjusting weights to reduce error.'],
    ['"Deep" in deep learning refers to…',['how serious it is','many layers in the network','the amount of data','deep-sea research'],1,'Many stacked layers let it learn complex patterns.'],
    ['The 2017 design behind ChatGPT, Claude and Gemini is the…',['Perceptron','Transformer','Turing test','Diffusion model'],1,'The Transformer, built around "attention".'],
    ['An AI hiring tool prefers men because past hires were mostly men. This is…',['overfitting','a GPU error','bias from the data','reinforcement learning'],2,'AI copies patterns in its data, including unfair ones.'],
    ['Google Maps finding your fastest route is mainly an example of…',['search','clustering','diffusion','fine-tuning'],0,'Route-finding is search: exploring paths through a network to find the cheapest one.'],
    ['A rare disease affects 1 in 1,000 people. A 99%-accurate test says you have it. Your chance of having it is roughly…',['99%','50%','9%','1%'],2,'Base rates matter: about 10 healthy people test positive for every 1 real case.'],
    ['A fraud model catches 95% of fraud, but most of its alerts are false alarms. It has…',['high precision, low recall','high recall, low precision','high accuracy only','no bias'],1,'It catches most fraud (high recall) but its alerts are often wrong (low precision).'],
    ['In the AI project cycle, what comes first?',['Modelling','Data exploration','Problem scoping','Deployment'],2,'You start by scoping the problem: who, what, where, why, and a measurable goal.'],
    ['India\'s law on how companies may use your personal data is the…',['EU AI Act','DPDP Act','IT Act 1990','RTI Act'],1,'The Digital Personal Data Protection Act, 2023, made fully operational by Rules notified in November 2025.']
  ];
  let ans={};
  const renderQ=()=>{
    g('qs').innerHTML=Q.map((q,i)=>'<div class="q" data-i="'+i+'"><p>'+(i+1)+'. '+esc(q[0])+'</p><div class="opts">'+q[1].map((o,j)=>'<button type="button" data-j="'+j+'">'+esc(o)+'</button>').join('')+'</div><div class="why"></div></div>').join('');
    g('qs').querySelectorAll('.q').forEach(div=>{const i=+div.dataset.i;div.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{if(ans[i]!==undefined)return;const j=+b.dataset.j;ans[i]=j;
      div.querySelectorAll('button').forEach(x=>{const k=+x.dataset.j;if(k===Q[i][2])x.classList.add('right');else if(k===j)x.classList.add('wrong');x.setAttribute('aria-disabled','true')});
      div.querySelector('.why').textContent=(j===Q[i][2]?'Correct. ':'Not quite. ')+Q[i][3];score()}))});
  };
  const score=()=>{const n=Object.keys(ans).length;const s=Object.entries(ans).filter(([i,j])=>Q[i][2]===j).length;const T=Q.length,P=Math.ceil(T*0.7);g('score').textContent=s+' / '+T;
    g('verdict').textContent=n<T?(T-n)+' to go':(s>=P?'You\'ve got the foundations.':'Revise the lessons you missed and retake');
    if(n===T&&s>=P)store.set('aiSchoolPassed','1')};
  g('retake').addEventListener('click',()=>{ans={};renderQ();score()});
  renderQ();score();

  const lj=document.getElementById('lessonJump');
  lj.addEventListener('change',()=>{const t=document.getElementById(lj.value);if(t){t.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});history.replaceState(null,'','#'+lj.value)}});
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)lj.value=e.target.id})},{rootMargin:'-30% 0px -60% 0px'});['l1','l2','l3','l4','l5','l6','l7','l8','l9','l10','l11','l12','exam'].forEach(id=>{const el=document.getElementById(id);if(el)io.observe(el)})}

  /* base-rate calculator */
  const nf=new Intl.NumberFormat('en-IN');
  const bayes=()=>{const r=+g('bRate').value,se=+g('bSens').value/100,fp=+g('bFp').value/100;
    g('obRate').textContent=nf.format(r);g('obSens').textContent=Math.round(se*100)+'%';g('obFp').textContent=(fp*100).toFixed(1).replace(/\.0$/,'')+'%';
    const N=10000,sick=N/r,healthy=N-sick,tp=sick*se,fpos=healthy*fp,p=tp/(tp+fpos||1);
    const f=x=>x<10?x.toFixed(1).replace(/\.0$/,''):nf.format(Math.round(x));
    g('bayes').innerHTML='<div class="bx"><span class="num">'+f(sick)+'</span>actually have it</div><div class="bx"><span class="num">'+f(tp)+'</span>of them test positive</div><div class="bx warn"><span class="num">'+f(fpos)+'</span>healthy people also test positive</div>';
    g('bOut').textContent=(p*100<1?(p*100).toFixed(1):Math.round(p*100))+'%';
    g('bVerdict').textContent=p<0.5?'Most positives are false alarms':'Most positives are real';};
  ['bRate','bSens','bFp'].forEach(id=>g(id).addEventListener('input',bayes));bayes();

  /* threshold experiment */
  let sd=11;const rr=()=>(sd=sd*16807%2147483647)/2147483647;
  const cases=[];for(let i=0;i<40;i++){const fraud=i<8;let sc=fraud?55+rr()*42:5+rr()*62;if(fraud&&i===7)sc=38;if(!fraud&&i%11===3)sc=68+rr()*20;cases.push({f:fraud,s:Math.round(sc)})}
  cases.sort((a,b)=>a.s-b.s);
  const thrRun=()=>{const t=+g('thr').value;g('othr').textContent=t;
    let tp=0,fp=0,fn=0,tn=0;cases.forEach(c=>{const flag=c.s>t;if(flag&&c.f)tp++;else if(flag)fp++;else if(c.f)fn++;else tn++});
    g('strip').innerHTML=cases.map(c=>'<i class="'+(c.f?'f':'g')+(c.s>t?' on':'')+'" style="left:'+c.s+'%"></i>').join('')+'<b style="left:'+t+'%"></b>';
    g('cm').innerHTML='<div></div><div class="h">Really fraud</div><div class="h">Really genuine</div><div class="h">Flagged</div><div class="c tp"><span class="num">'+tp+'</span>caught</div><div class="c fp"><span class="num">'+fp+'</span>false alarms</div><div class="h">Not flagged</div><div class="c fn"><span class="num">'+fn+'</span>missed</div><div class="c tn"><span class="num">'+tn+'</span>correctly ignored</div>';
    const pc=tp+fp?tp/(tp+fp):0,rc=tp/(tp+fn),ac=(tp+tn)/40;
    g('prec').textContent=tp+fp?Math.round(pc*100)+'%':'–';g('rec').textContent=Math.round(rc*100)+'%';g('acc').textContent=Math.round(ac*100)+'%';};
  g('thr').addEventListener('input',thrRun);thrRun();
}
