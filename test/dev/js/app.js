import {register,show,menu,registerMenu} from './router.js';import {mountHQ} from './hq.js';
const $=id=>document.getElementById(id);
register('hq',mountHQ);
const visualPages=[['nano','NANO'],['alliance','ALLIANCE'],['network','NETWORK'],['vip','VIP'],['mail','MAIL'],['map','MAP'],['missions','MISSIONS'],['dailies','DAILIES'],['dailycomp','DAILY COMPETITION'],['weekly','WEEKLY COMPETITION'],['monthly','MONTHLY COMPETITION'],['alliancecomp','ALLIANCE COMPETITION'],['rankings','RANKINGS'],['crew','CREW'],['shop','SHOP'],['profile','PROFILE'],['settings','SETTINGS'],['updates','UPDATES']];
for(const [id,title] of visualPages)register(id,el=>{const head=document.createElement('div');head.className='dev-page-head';const kicker=document.createElement('span');kicker.className='dev-kicker';kicker.textContent='BACKDOOR HQ // DEVELOPMENT';const h=document.createElement('h2');h.textContent=title;const rule=document.createElement('div');rule.className='dev-head-rule';head.append(kicker,h,rule);const stage=document.createElement('div');stage.className='dev-empty-stage';stage.setAttribute('aria-label',title+' empty design canvas');stage.innerHTML='<div class="dev-stage-grid"></div><div class="dev-stage-corners"><i></i><i></i><i></i><i></i></div>';el.replaceChildren(head,stage)});
registerMenu([{id:'hq',label:'HQ',icon:'⌂'},{id:'nano',label:'NANO',icon:'⬡'},{id:'ops',label:'OPS',icon:'◎',children:[['missions','Missions'],['map','Map']]},{id:'event',label:'EVENT',icon:'◈',children:[['dailies','Dailies'],['dailycomp','Daily Comp'],['weekly','Weekly'],['monthly','Monthly'],['alliancecomp','Alliance']]},{id:'alliance',label:'ALLIANCE',icon:'♧'},{id:'network',label:'NETWORK',icon:'⌘'},{id:'mail',label:'MAIL',icon:'✉'},{id:'crew',label:'CREW',icon:'♙'},{id:'rankings',label:'RANKS',icon:'▥'}]);
function clock(){const d=new Date();$('clock').textContent=d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}clock();setInterval(clock,30000);
$('game').hidden=false;
$('commander').textContent='DEV COMMANDER';
menu($('bottomNav'),$('subnav'),$('view'));
show('hq');
// Development preview opens directly at HQ; no login or loading sequence.
// Intentionally no live account, API, localStorage, service worker or gameplay writes.
