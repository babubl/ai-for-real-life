/* Inner pages: glossary search, share and print buttons */
(function(){
  var A=window.AIRL;
  var q=document.getElementById('glq');
  if(q){
    var items=[].slice.call(document.querySelectorAll('#gl>div')),count=document.getElementById('glCount'),none=document.getElementById('glNone');
    var run=function(){var t=q.value.trim().toLowerCase(),n=0;items.forEach(function(d){var on=!t||d.textContent.toLowerCase().indexOf(t)>-1;d.hidden=!on;if(on)n++});count.textContent=t?n+' of '+items.length+' terms':items.length+' terms';none.hidden=n>0};
    q.addEventListener('input',run);run();
  }
  document.querySelectorAll('[data-share]').forEach(function(a){a.href='https://wa.me/?text='+encodeURIComponent('Worth 10 minutes for the whole family: how to stay safe from AI scams. '+A.SITE+a.getAttribute('data-share'))});
  document.querySelectorAll('[data-print]').forEach(function(b){b.addEventListener('click',function(){window.print()})});
})();
