/* Build page: capstone checklist saved on this device */
(function(){
  var store=window.AIRL.store,boxes=[].slice.call(document.querySelectorAll('#buildChecks input')),prog=document.getElementById('buildProg');
  var saved=store.json('aiBuild',{});
  var paint=function(){var n=0,st={};boxes.forEach(function(b){if(b.checked){n++;st[b.id]=1}});store.set('aiBuild',JSON.stringify(st));prog.textContent=n===boxes.length?'All done. Your site is live. Well done!':n+' of '+boxes.length+' done'};
  boxes.forEach(function(b){b.checked=!!saved[b.id];b.addEventListener('change',paint)});paint();
})();
