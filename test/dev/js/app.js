import {register,show,menu,registerMenu} from './router.js';import {mountHQ} from './hq.js';
const $=id=>document.getElementById(id);
register('hq',mountHQ);
for(const [id,title] of [['nano','NANO'],['alliance','ALLIANCE'],['network','NETWORK'],['vip','VIP'],['mail','MAIL'],['map','MAP'],['missions','MISSIONS'],['dailies','DAILIES'],['dailycomp','DAILY COMPETITION'],['weekly','WEEKLY COMPETITION'],['monthly','MONTHLY COMPETITION'],['alliancecomp','ALLIANCE COMPETITION']])register(id,el=>{el.innerHTML='<h2>'+title+'</h2><p class="subtitle">INDEPENDENT DEVELOPMENT MODULE</p><div class="panel empty"><strong>MODULE RESERVED</strong>This area is ready for its own feature file.<br>Live gameplay has not been imported.</div>'});
registerMenu([{id:'hq',label:'HQ',icon:'⌂'},{id:'nano',label:'NANO',icon:'⬡'},{id:'ops',label:'OPS',icon:'◎',children:[['missions','Missions'],['map','Map']]},{id:'event',label:'EVENT',icon:'◈',children:[['dailies','Dailies'],['dailycomp','Daily Comp'],['weekly','Weekly'],['monthly','Monthly'],['alliancecomp','Alliance']]},{id:'alliance',label:'ALLIANCE',icon:'♧'},{id:'network',label:'NETWORK',icon:'⌘'},{id:'mail',label:'MAIL',icon:'✉'}]);
function clock(){const d=new Date();$('clock').textContent=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}clock();setInterval(clock,30000);
$('game').hidden=false;
$('commander').textContent='DEV COMMANDER';
menu($('bottomNav'),$('subnav'),$('view'));
show('hq');
// Development preview opens directly at HQ; no login or loading sequence.
// Intentionally no live account, API, localStorage, service worker or gameplay writes.
