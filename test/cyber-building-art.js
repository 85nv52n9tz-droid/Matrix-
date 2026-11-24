(function(){/* ---------- isometric drawing kit ---------- */
let _s=7;const rnd=()=>(_s=(_s*16807)%2147483647)/2147483647;
const f=n=>Math.round(n*10)/10,H=c=>c.slice(1);
const P=(u,v,z=0)=>f(u-v)+','+f((u+v)/2-z);
const Q=(pts,fill,stroke,sw,ex)=>`<path d="M${pts.map(p=>P(...p)).join('L')}Z" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${sw||1}"`:''} ${ex||''}/>`;
const L=(a,b,stroke,sw,ex)=>`<path d="M${P(...a)}L${P(...b)}" stroke="${stroke}" stroke-width="${sw||1}" fill="none" ${ex||''}/>`;
const an=(attr,vals,dur,ex)=>`<animate attributeName="${attr}" values="${vals}" dur="${dur}s" repeatCount="indefinite" ${ex||''}/>`;
const rot=(dur,rev,cx,cy)=>`<animateTransform attributeName="transform" type="rotate" from="${rev?360:0} ${cx||0} ${cy||0}" to="${rev?0:360} ${cx||0} ${cy||0}" dur="${dur}s" repeatCount="indefinite"/>`;
const mv=(vals,dur)=>`<animateTransform attributeName="transform" type="translate" values="${vals}" dur="${dur}s" repeatCount="indefinite"/>`;
const plane=(u,v,z,inner)=>`<g transform="translate(${P(u,v,z)}) matrix(1 .5 -1 .5 0 0)">${inner}</g>`;
const ringp=(r,c,dash,dur,rev,w)=>`<circle r="${r}" fill="none" stroke="${c}" stroke-width="${w||2}" stroke-dasharray="${dash}" vector-effect="non-scaling-stroke">${rot(dur,rev)}</circle>`;
const orbit=(u,v,z,r,dur,col,rad,rev)=>{const x=u-v,y=(u+v)/2-z,rx=r*1.414,ry=r*.707,d=rev?1:0;return `<circle r="${rad||2.6}" fill="${col}"><animateMotion dur="${dur}s" repeatCount="indefinite" path="M${f(x-rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 ${d} ${f(2*rx)} 0a${f(rx)} ${f(ry)} 0 1 ${d} ${f(-2*rx)} 0"/></circle>`};
const bolt=(x1,y1,x2,y2,c,dl,n)=>{let d=`M${x1} ${y1}`;n=n||6;for(let i=1;i<n;i++){const t=i/n;d+=`L${f(x1+(x2-x1)*t+(rnd()-.5)*16)} ${f(y1+(y2-y1)*t+(rnd()-.5)*12)}`}return `<path class="bolt" d="${d}L${x2} ${y2}" fill="none" stroke="#fff" stroke-width="1.6" style="animation-delay:-${dl}s"/><path class="bolt" d="${d}L${x2} ${y2}" fill="none" stroke="${c}" stroke-width="4" opacity=".55" style="animation-delay:-${dl}s"/>`};
const wins=(u,v,z,a,b,h,c,cols,rows)=>{cols=cols||Math.max(2,Math.round(a/7));rows=rows||Math.max(2,Math.round(h/10));let dim='',br='',wh='',fk='',fk2='';
 for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)for(let side=0;side<2;side++){const r=rnd();if(r<.26)continue;const s0=(i+.2)/cols,s1=(i+.8)/cols,z0=z+h*(.07+.86*(j+.18)/rows),z1=z+h*(.07+.86*(j+.82)/rows);
  const pts=side?[[u+a,v-b+2*b*s0,z0],[u+a,v-b+2*b*s1,z0],[u+a,v-b+2*b*s1,z1],[u+a,v-b+2*b*s0,z1]]:[[u-a+2*a*s0,v+b,z0],[u-a+2*a*s1,v+b,z0],[u-a+2*a*s1,v+b,z1],[u-a+2*a*s0,v+b,z1]];
  const d='M'+pts.map(p=>P(...p)).join('L')+'Z';if(r>.95)wh+=d;else if(r>.78)fk+=d;else if(r>.7)fk2+=d;else if(r>.5)br+=d;else dim+=d}
 return `<path d="${dim}" fill="${c}" opacity=".3"/><path d="${br}" fill="${c}" opacity=".85"/><path d="${wh}" fill="#fff" opacity=".95"/><path class="fk" d="${fk}" fill="${c}"/><path class="fk" d="${fk2}" fill="#fff" style="animation-delay:-1.3s"/>`};
const box=(u,v,z,a,b,h,c,o)=>{o=o||{};const g=H(c);let s='';
 s+=Q([[u-a,v+b,z],[u+a,v+b,z],[u+a,v+b,z+h],[u-a,v+b,z+h]],`url(#L${g})`,c,.8,'stroke-opacity=".75"');
 s+=Q([[u+a,v-b,z],[u+a,v+b,z],[u+a,v+b,z+h],[u+a,v-b,z+h]],`url(#R${g})`,c,.8,'stroke-opacity=".95"');
 if(!o.nowin&&h>10)s+=wins(u,v,z,a,b,h,c,o.cols,o.rows);
 s+=`<path d="M${P(u+a,v+b,z)}L${P(u+a,v+b,z+h)}" stroke="${c}" stroke-width="4" opacity=".3"/><path d="M${P(u+a,v+b,z)}L${P(u+a,v+b,z+h)}" stroke="#fff" stroke-width="1.1" opacity=".9"/>`;
 s+=Q([[u-a,v-b,z+h],[u+a,v-b,z+h],[u+a,v+b,z+h],[u-a,v+b,z+h]],`url(#T${g})`,c,1.5);
 if(a>9&&b>9)s+=Q([[u-a*.55,v-b*.55,z+h],[u+a*.55,v-b*.55,z+h],[u+a*.55,v+b*.55,z+h],[u-a*.55,v+b*.55,z+h]],c,c,.8,'fill-opacity=".22" stroke-opacity=".8"');
 return s};
const cyl=(u,v,z,r,h,c,o)=>{o=o||{};const cx=u-v,cy=(u+v)/2-z,g=H(c);let s=`<path d="M${f(cx-r)} ${f(cy-h)}V${f(cy)}A${r} ${r/2} 0 0 0 ${f(cx+r)} ${f(cy)}V${f(cy-h)}A${r} ${r/2} 0 0 0 ${f(cx-r)} ${f(cy-h)}Z" fill="url(#C${g})" stroke="${c}" stroke-width=".9"/>`;
 for(let k=1;k<=(o.bands===undefined?2:o.bands);k++){const y=cy-h*k/((o.bands===undefined?2:o.bands)+1);s+=`<path d="M${f(cx-r)} ${f(y)}A${r} ${r/2} 0 0 0 ${f(cx+r)} ${f(y)}" fill="none" stroke="${c}" stroke-width="1" opacity=".6"/>`}
 s+=`<ellipse cx="${f(cx)}" cy="${f(cy-h)}" rx="${r}" ry="${r/2}" fill="${c}" fill-opacity=".3" stroke="${c}" stroke-width="1.3"/><ellipse cx="${f(cx)}" cy="${f(cy-h)}" rx="${f(r*.55)}" ry="${f(r*.275)}" fill="#fff" fill-opacity=".25"/>`;return s};
const halo=(x,y,r,c,op)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#G${H(c)})" opacity="${op||.3}"/>`;
const pad=(a,c)=>{const g=H(c);let s=`<ellipse cx="0" cy="${a*.55}" rx="${a*2.3}" ry="${a*1.15}" fill="url(#G${g})" opacity=".22"/>`;
 s+=box(0,0,-8,a,a,8,c,{nowin:1});s+=Q([[-a,-a,0],[a,-a,0],[a,a,0],[-a,a,0]],'#040a1e',c,1.8);
 let gl='';for(let i=1;i<6;i++){const t=-a+2*a*i/6;gl+=`M${P(t,-a,0)}L${P(t,a,0)}M${P(-a,t,0)}L${P(a,t,0)}`}
 s+=`<path d="${gl}" stroke="${c}" stroke-width=".7" opacity=".4" fill="none"/>`;
 s+=Q([[-a+6,-a+6,0],[a-6,-a+6,0],[a-6,a-6,0],[-a+6,a-6,0]],'none',c,2.6,'opacity=".28"');
 [[-a,-a],[a,-a],[a,a],[-a,a]].forEach((q,i)=>{s+=`<circle cx="${P(q[0],q[1],0).split(',')[0]}" cy="${P(q[0],q[1],0).split(',')[1]}" r="2.4" fill="#fff">${an('opacity','1;.2;1',1.2+i*.3)}</circle>`});
 s+=plane(0,0,0,ringp(a*.92,c,'14 10',22,0,1.4));
 s+=`<path d="M${P(-a,-a,0)}L${P(a,-a,0)}L${P(a,a,0)}L${P(-a,a,0)}Z" pathLength="100" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="7 93" stroke-linecap="round">${an('stroke-dashoffset','0;-100',3.4)}</path>`;return s};
const awning=(u,v,a,b,z,c1,c2)=>{let s='';for(let i=0;i<4;i++){const x0=u-a+i*a/2,x1=u-a+(i+1)*a/2;s+=Q([[x0,v-b,z],[x1,v-b,z],[x1,v+b,z],[x0,v+b,z]],i%2?c2:c1,'#fff',.5)}return s+L([u-a,v+b,z],[u+a,v+b,z],'#fff',1)};

/* ---------- one individual design per building ---------- */
const ART={
'Headquarters':c=>{_s=11;let s='';
 s+=box(-54,24,0,16,26,48,c,{cols:3,rows:5})+box(24,-54,0,26,16,42,c,{cols:4,rows:4});
 s+=box(0,0,0,50,50,40,c,{cols:8,rows:3})+box(0,0,40,38,38,58,c,{cols:6,rows:7})+box(0,0,98,26,26,44,c,{cols:4,rows:5});
 s+=cyl(0,0,142,17,8,c,{bands:0})+L([0,0,150],[0,0,192],'#fff',2);
 s+=halo(0,-196,18,c,.9)+`<circle cx="0" cy="-196" r="5" fill="#fff">${an('r','4;7;4',1.2)}</circle>`;
 s+=plane(0,0,112,ringp(62,c,'12 9',14)+ringp(46,'#fff','2 10',9,1,1.4))+orbit(0,0,112,62,4,'#fff',3);
 s+=plane(0,0,62,ringp(76,'#ff2bd6','6 10',18,1))+orbit(0,0,62,76,5.5,'#ff2bd6',3,1);
 s+=L([0,0,100],[0,0,176],c,10,'opacity=".12"');return s},
'Data Centre':c=>{_s=21;let s='';
 s+=`<path d="M${P(-26,-26,2)}L${P(-26,26,2)}L${P(26,26,2)}L${P(26,-26,2)}Z" fill="none" stroke="${c}" stroke-width="2.2" stroke-dasharray="7 9" opacity=".85">${an('stroke-dashoffset','0;-32',1.3)}</path>`;
 s+=box(-26,-26,0,14,14,98,c,{cols:2,rows:15})+box(26,-26,0,14,14,66,c,{cols:2,rows:10});
 s+=box(-26,26,0,14,14,78,c,{cols:2,rows:12})+cyl(0,0,0,12,36,c,{bands:3});
 for(let k=0;k<3;k++)s+=`<path d="M${(k-1)*8} -40V-130" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 9" opacity=".9">${an('stroke-dashoffset','0;-24',.8+k*.2)}</path>`;
 s+=box(26,26,0,14,14,52,c,{cols:2,rows:8});
 s+=`<g transform="translate(${P(-26,-26,98)})"><ellipse rx="16" ry="6" cy="-10" fill="${c}" fill-opacity=".35" stroke="${c}" transform="rotate(-25 0 -10)"/><path d="M0 0V-10" stroke="${c}" stroke-width="2"/><circle cy="-14" r="2.4" fill="#fff">${an('opacity','1;.2;1',1)}</circle></g>`;
 s+=`<text class="bin" x="-70" y="-30" fill="${c}">1011</text><text class="bin" x="64" y="-10" fill="${c}" style="animation-delay:-3s">0110</text>`;return s},
'Cyber Lab':c=>{_s=31;let s='';
 s+=cyl(-30,54,0,9,46,c,{bands:1})+`<rect x="-89" y="-30" width="10" height="26" rx="4" fill="#fff" opacity=".55">${an('opacity','.35;.7;.35',1.4)}</rect>`+cyl(-12,54,0,9,34,c,{bands:1});
 s+=box(0,0,0,46,38,28,c,{cols:7,rows:3});
 s+=`<ellipse cx="0" cy="-28" rx="39" ry="19" fill="${c}" fill-opacity=".3" stroke="${c}"/><path d="M-39 -28A39 39 0 0 1 39 -28Z" fill="url(#D${H(c)})" stroke="${c}" stroke-width="1.6"/>`;
 s+=`<g transform="translate(0,-52)">`;[0,60,120].forEach((a,i)=>{s+=`<g transform="rotate(${a})"><ellipse rx="27" ry="8" fill="none" stroke="${c}" stroke-width="1.5"/><circle r="2.8" fill="#fff"><animateMotion dur="${1.8+i*.5}s" repeatCount="indefinite" path="M-27 0a27 8 0 1 0 54 0a27 8 0 1 0 -54 0"/></circle></g>`});
 s+=`<circle r="6" fill="#fff">${an('r','5;8;5',1.3)}</circle><circle r="16" fill="url(#G${H(c)})" opacity=".7"/></g>`;
 for(let i=0;i<4;i++)s+=`<circle cx="${-84+i*5}" cy="-4" r="2" fill="#fff"><animate attributeName="cy" values="-4;-34" dur="${2+i*.4}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="${2+i*.4}s" repeatCount="indefinite"/></circle>`;
 return s},
'AI Core':c=>{_s=41;let s='';
 s+=cyl(0,0,0,40,14,c,{bands:1})+cyl(0,0,14,28,10,c,{bands:0});
 const pyl=[[-40,-40],[40,-40],[-40,40],[40,40]],cc=[0,-98];
 const beam=q=>`<path d="M${P(q[0],q[1],48)}L${cc[0]} ${cc[1]}" stroke="${c}" stroke-width="1.6" stroke-dasharray="4 5" fill="none">${an('stroke-dashoffset','0;-18',.9)}</path>`;
 pyl.slice(0,2).forEach(q=>{s+=box(q[0],q[1],0,5,5,46,c,{nowin:1})+`<circle cx="${P(q[0],q[1],50).split(',')[0]}" cy="${P(q[0],q[1],50).split(',')[1]}" r="3.2" fill="#fff"/>`+beam(q)});
 s+=`<g>${mv('0 0;0 -5;0 0',3)}`+halo(0,-98,64,c,.45)+`<circle cx="0" cy="-98" r="38" fill="#050c26" stroke="${c}" stroke-width="2"/><circle cx="0" cy="-98" r="38" fill="url(#G${H(c)})" opacity=".55"/>`;
 const nd=[[-20,-14],[-4,-27],[15,-17],[25,1],[8,15],[-14,12],[-27,0],[2,-2]],ed=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[1,7],[7,3],[7,5],[0,7],[2,7]];
 ed.forEach(e=>s+=`<path d="M${nd[e[0]][0]} ${-98+nd[e[0]][1]}L${nd[e[1]][0]} ${-98+nd[e[1]][1]}" stroke="#fff" stroke-width=".9" opacity=".7"/>`);
 nd.forEach((n,i)=>s+=`<circle class="fk" cx="${n[0]}" cy="${-98+n[1]}" r="${i==7?4.5:2.8}" fill="${i==7?'#fff':c}" style="animation-delay:-${i*.33}s"/>`);
 s+=`<g transform="translate(0,-98) rotate(-18)"><ellipse rx="68" ry="17" fill="none" stroke="${c}" stroke-width="1.6" stroke-dasharray="3 5"/>`;
 for(let i=0;i<3;i++)s+=`<circle r="3.2" fill="#fff"><animateMotion dur="${4+i}s" begin="-${i*1.4}s" repeatCount="indefinite" path="M-68 0a68 17 0 1 0 136 0a68 17 0 1 0 -136 0"/></circle>`;
 s+=`</g></g>`;
 pyl.slice(2).forEach(q=>{s+=box(q[0],q[1],0,5,5,46,c,{nowin:1})+`<circle cx="${P(q[0],q[1],50).split(',')[0]}" cy="${P(q[0],q[1],50).split(',')[1]}" r="3.2" fill="#fff"/>`+beam(q)});return s},
'Quantum Reactor':c=>{_s=51;let s='';
 s+=halo(0,-52,76,c,.28);
 s+=cyl(-44,44,0,6,58,c,{bands:3})+halo(-88,-62,13,c,.9)+`<circle cx="-88" cy="-62" r="4.5" fill="#fff">${an('r','3.5;6;3.5',.8)}</circle>`;
 s+=cyl(44,-44,0,6,58,c,{bands:3})+halo(88,-62,13,c,.9)+`<circle cx="88" cy="-62" r="4.5" fill="#fff">${an('r','3.5;6;3.5',.8)}</circle>`;
 s+=box(0,0,0,50,50,10,c,{nowin:1})+cyl(0,0,10,32,70,c,{bands:4});
 s+=`<rect x="-8" y="-78" width="16" height="64" rx="8" fill="#fff" opacity=".85">${an('opacity','.95;.45;.95',.9)}</rect><rect x="-14" y="-80" width="28" height="68" rx="14" fill="${c}" opacity=".25">${an('opacity','.35;.12;.35',.9)}</rect>`;
 [30,52,72].forEach((z,i)=>{s+=`<ellipse cx="0" cy="${-z}" rx="${40-i*2}" ry="13" fill="none" stroke="${i==1?'#fff':c}" stroke-width="2.2" stroke-dasharray="${8+i*3} 7">${an('stroke-dashoffset',i%2?'0;30':'0;-30',1.4+i*.3)}</ellipse>`});
 s+=cyl(0,0,80,16,8,c,{bands:0})+bolt(-88,-62,0,-92,c,.2)+bolt(88,-62,0,-92,c,.7)+bolt(0,-92,-6,-158,c,.4,7)+bolt(0,-92,10,-150,'#fff',1,6);
 s+=`<circle cx="0" cy="-92" r="6" fill="#fff">${an('r','5;9;5',.6)}</circle>`;return s},
'Nano Foundry':c=>{_s=61;let s='';
 s+=cyl(-34,-30,0,8,66,c,{bands:2})+cyl(-8,-30,0,8,54,c,{bands:2});
 [[-34,-30,66],[-8,-30,54]].forEach((q,i)=>{const p=P(q[0],q[1],q[2]).split(',');s+=`<ellipse cx="${p[0]}" cy="${p[1]}" rx="6" ry="3" fill="#ff9a1a">${an('opacity','1;.4;1',.7)}</ellipse>`;for(let k=0;k<3;k++)s+=`<circle cx="${p[0]}" cy="${p[1]-4}" r="5" fill="#8aa0b8" opacity="0"><animate attributeName="cy" values="${p[1]-4};${p[1]-54}" dur="3s" begin="-${k+i*.7}s" repeatCount="indefinite"/><animate attributeName="opacity" values=".6;0" dur="3s" begin="-${k+i*.7}s" repeatCount="indefinite"/><animate attributeName="r" values="4;11" dur="3s" begin="-${k+i*.7}s" repeatCount="indefinite"/></circle>`});
 s+=box(0,-6,0,56,32,34,c,{cols:10,rows:3});
 for(let i=0;i<4;i++)s+=box(-36+i*24,-6,34,10,24,10,c,{nowin:1});
 s+=Q([[56,-16,0],[56,4,0],[56,4,24],[56,-16,24]],'url(#mo)','#fff',1)+`<path d="M${P(56,-16,0)}L${P(56,4,0)}L${P(56,4,24)}L${P(56,-16,24)}Z" fill="#ffb000" opacity=".4">${an('opacity','.15;.55;.15',.5)}</path>`;
 s+=box(0,46,0,44,6,5,c,{nowin:1})+`<g>${mv('0 0;60 30',3)}${box(-30,46,5,6,5,7,'#ffe600',{nowin:1})}</g>`;
 const bp=P(38,52,10).split(',');
 s+=cyl(38,52,0,8,10,c,{bands:0})+`<g transform="translate(${bp[0]},${bp[1]})"><g>${an('opacity','1;1',1)}<animateTransform attributeName="transform" type="rotate" values="-14;16;-14" dur="2.4s" repeatCount="indefinite"/><path d="M0 0L-6 -30L22 -50" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/><path d="M0 0L-6 -30L22 -50" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><circle cx="-6" cy="-30" r="4.5" fill="#050c26" stroke="${c}" stroke-width="2"/><path d="M22 -50l-6 -7M22 -50l8 -4" stroke="#fff" stroke-width="2"/><circle class="fk" cx="24" cy="-52" r="3" fill="#ffe600"/><circle class="fk" cx="30" cy="-46" r="2" fill="#fff" style="animation-delay:-.7s"/></g></g>`;return s},
'Crew Command':c=>{_s=71;let s='';
 s+=box(0,0,0,52,36,26,c,{cols:9,rows:2});
 s+=Q([[-42,36,5],[42,36,5],[42,36,21],[-42,36,21]],'#02101f',c,1.2);
 let pts='';for(let k=0;k<=16;k++)pts+=(k?'L':'M')+P(-42+k*5.25,36,13+Math.sin(k*1.1)*5+Math.cos(k*.5)*2);
 s+=`<path d="${pts}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="6 3">${an('stroke-dashoffset','0;-18',.8)}</path><path d="${pts}" fill="none" stroke="${c}" stroke-width="4" opacity=".4"/>`;
 s+=box(8,-8,26,9,9,60,c,{cols:1,rows:7});
 const dp=P(8,-8,92).split(',');
 s+=`<g transform="translate(${dp[0]},${dp[1]})"><g><animateTransform attributeName="transform" type="scale" values="1 1;.25 1;-1 1;.25 1;1 1" dur="5s" repeatCount="indefinite"/><path d="M-26 0Q0 -26 26 0Q0 -8 -26 0Z" fill="${c}" fill-opacity=".45" stroke="${c}" stroke-width="1.6"/><path d="M0 -6V-22" stroke="#fff" stroke-width="2"/><circle cy="-24" r="3" fill="#fff"/></g></g>`;
 [[-40,-26],[40,-30]].forEach((q,i)=>{const p=P(q[0],q[1],26).split(',');s+=cyl(q[0],q[1],26,4,26,c,{bands:0})+`<circle cx="${p[0]}" cy="${f(p[1]-28)}" r="3" fill="#ff2e63">${an('opacity','1;.1;1',1+i*.4)}</circle>`});
 s+=bolt(-30,-70,-8,-90,c,.5,4).replace(/stroke-width="4"/,'stroke-width="3"');
 s+=halo(0,-60,48,c,.14);return s},
'Repair Centre':c=>{_s=81;let s='';
 s+=box(0,-8,0,40,26,24,c,{cols:7,rows:2})+box(0,-8,24,40,20,6,c,{nowin:1})+box(0,-8,30,40,12,5,c,{nowin:1});
 s+=Q([[40,-12,6],[40,-4,6],[40,-4,20],[40,-12,20]],'#fff',c,1,'class="fk"')+Q([[40,-20,10],[40,4,10],[40,4,16],[40,-20,16]],'#fff',c,1,'class="fk"');
 s+=Q([[40,-12,6],[40,-4,6],[40,-4,20],[40,-12,20]],c,'none',0,'opacity=".5"');
 [[-22,44],[22,44]].forEach(q=>{s+=box(q[0],q[1],0,3,3,48,c,{nowin:1})});
 s+=box(0,44,48,24,3,4,c,{nowin:1});
 const gp=P(0,44,48).split(',');
 s+=`<g transform="translate(${gp[0]},${gp[1]})"><g>${mv('0 0;0 12;0 0',2.6)}<path d="M0 0V20" stroke="${c}" stroke-width="2"/><path d="M-9 20h18l-4 9h-10Z" fill="#fff" stroke="${c}"/></g></g>`;
 for(let i=0;i<5;i++){const p=P(-6+i*3,44,3).split(',');s+=`<circle class="fk" cx="${p[0]}" cy="${p[1]}" r="${i%2?2.4:1.6}" fill="${i%2?'#fff':c}" style="animation-delay:-${i*.45}s"/>`}
 for(let i=0;i<4;i++)s+=`<text x="${-70+i*34}" y="-30" font-size="14" font-weight="800" fill="${c}" opacity="0"><animate attributeName="y" values="-20;-86" dur="3.4s" begin="-${i*.9}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;1;0" dur="3.4s" begin="-${i*.9}s" repeatCount="indefinite"/>+</text>`;return s},
'Vault':c=>{_s=91;let s='';
 const T=[[-50,-50],[50,-50],[-50,50],[50,50]],tp=q=>P(q[0],q[1],34).split(',');
 const lz=(a,b)=>`<path d="M${tp(a)}L${tp(b)}" stroke="#ff2e63" stroke-width="2" stroke-dasharray="5 4" fill="none">${an('stroke-dashoffset','0;-18',.5)}</path><path d="M${tp(a)}L${tp(b)}" stroke="#ff2e63" stroke-width="6" opacity=".25" fill="none" class="fk"/>`;
 s+=cyl(T[0][0],T[0][1],0,7,28,c,{bands:1})+cyl(T[1][0],T[1][1],0,7,28,c,{bands:1})+lz(T[0],T[1]);
 s+=box(0,0,0,40,40,54,c,{nowin:1})+box(0,0,54,34,34,6,c,{nowin:1});
 [[-30,-30],[30,-30],[-30,30],[30,30]].forEach(q=>{const p=P(q[0],q[1],59).split(',');s+=`<circle cx="${p[0]}" cy="${p[1]}" r="2.4" fill="#fff"/>`});
 s+=`<g transform="matrix(-1 .5 0 -1 40 20)"><circle cx="0" cy="26" r="21" fill="#0a0414" stroke="${c}" stroke-width="3" vector-effect="non-scaling-stroke"/><circle cx="0" cy="26" r="15" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 3" vector-effect="non-scaling-stroke"><animateTransform attributeName="transform" type="rotate" from="0 0 26" to="360 0 26" dur="7s" repeatCount="indefinite"/></circle><g><animateTransform attributeName="transform" type="rotate" from="360 0 26" to="0 0 26" dur="9s" repeatCount="indefinite"/><path d="M-12 26h24M0 14v24M-8.5 17.5l17 17M8.5 17.5l-17 17" stroke="${c}" stroke-width="2.5" vector-effect="non-scaling-stroke"/></g><circle cx="0" cy="26" r="5" fill="#fff" class="fk"/></g>`;
 s+=`<g transform="matrix(1 .5 0 -1 -40 20)"><rect x="-14" y="12" width="28" height="30" fill="#05020c" stroke="${c}" vector-effect="non-scaling-stroke"/>`;
 for(let i=0;i<9;i++)s+=`<rect class="fk" x="${-11+(i%3)*8.5}" y="${15+Math.floor(i/3)*8.5}" width="6" height="6" fill="${i==4?'#fff':c}" style="animation-delay:-${i*.37}s"/>`;
 s+=`</g>`;
 s+=lz(T[2],T[3])+lz(T[0],T[2])+cyl(T[2][0],T[2][1],0,7,28,c,{bands:1})+cyl(T[3][0],T[3][1],0,7,28,c,{bands:1});
 const lp=P(0,0,62).split(',');
 s+=`<g transform="translate(${lp[0]},${lp[1]})">${mv('0 0;0 -4;0 0',1.8)}<path d="M-8 -12V-18A8 8 0 0 1 8 -18V-12" fill="none" stroke="#fff" stroke-width="3"/><rect x="-12" y="-12" width="24" height="17" rx="3" fill="${c}"/><circle cy="-4" r="2.6" fill="#05020c"/></g>`;
 s+=halo(0,-70,28,c,.45);return s},
'Alliance Embassy':c=>{_s=101;let s='';
 s+=box(-28,0,0,14,18,88,c,{cols:2,rows:10});
 s+=box(0,0,50,16,10,9,c,{cols:3,rows:1})+box(0,26,0,18,12,26,c,{cols:3,rows:2});
 s+=box(28,0,0,14,18,74,c,{cols:2,rows:9});
 [[-28,88,0],[28,74,.4]].forEach((q,i)=>{const p=P(q[0],0,q[1]).split(',');const x=+p[0],y=+p[1]-26;s+=`<path d="M${p[0]} ${p[1]}V${y}" stroke="#fff" stroke-width="2"/><polygon fill="${i?'#ff2bd6':c}" points="${x},${y} ${x+22},${y+3} ${x},${y+10}"><animate attributeName="points" dur="1.1s" begin="-${q[2]}s" repeatCount="indefinite" values="${x},${y} ${x+22},${y+2} ${x},${y+10};${x},${y} ${x+20},${y+8} ${x},${y+10};${x},${y} ${x+22},${y+2} ${x},${y+10}"/></polygon>`});
 s+=`<g>${mv('0 0;0 -5;0 0',2.6)}<path d="M0 -122L24 -113V-94Q24 -78 0 -68Q-24 -78 -24 -94V-113Z" fill="${c}" fill-opacity=".28" stroke="${c}" stroke-width="2.2"/><path d="M0 -112L14 -107V-95Q14 -85 0 -79Q-14 -85 -14 -95V-107Z" fill="none" stroke="#fff" stroke-width="1.4"/><path d="M-6 -96l5 5 9 -10" fill="none" stroke="#fff" stroke-width="2.2"/></g>`;
 s+=`<ellipse cx="0" cy="-58" rx="28" ry="8" fill="none" stroke="${c}" stroke-width="1.6" stroke-dasharray="5 4">${an('stroke-dashoffset','0;-18',1.2)}</ellipse>`+halo(0,-96,44,c,.2);return s},
'Recon Tower':c=>{_s=111;let s='';
 s+=plane(0,0,1,`<g>${rot(4.2)}<path d="M0 0L58 -17A60 60 0 0 1 58 17Z" fill="${c}" opacity=".5"/></g><circle r="56" fill="none" stroke="${c}" stroke-width="1.5" vector-effect="non-scaling-stroke" opacity=".75"/><circle r="34" fill="none" stroke="${c}" stroke-width="1" stroke-dasharray="3 5" vector-effect="non-scaling-stroke" opacity=".6"/>`);
 s+=box(0,0,0,24,24,16,c,{cols:4,rows:1});
 const base=[[-14,-14],[14,-14],[-14,14],[14,14]],top=[[-4,-4],[4,-4],[-4,4],[4,4]];
 [0,1].forEach(i=>{s+=L([base[i][0],base[i][1],16],[top[i][0],top[i][1],150],c,2.4)});
 for(let k=0;k<5;k++){const z0=16+k*26,z1=z0+26,r0=14-k*2,r1=14-(k+1)*2;s+=L([-r0,-r0,z0],[r1,-r1,z1],c,1,'opacity=".8"')+L([r0,-r0,z0],[-r1,-r1,z1],c,1,'opacity=".8"')+L([-r0,r0,z0],[r1,r1,z1],c,1,'opacity=".8"')+L([r0,r0,z0],[-r1,r1,z1],c,1,'opacity=".8"')+Q([[-r1,-r1,z1],[r1,-r1,z1],[r1,r1,z1],[-r1,r1,z1]],'none',c,1.2)}
 [2,3].forEach(i=>{s+=L([base[i][0],base[i][1],16],[top[i][0],top[i][1],150],c,2.4)});
 const tp=P(0,0,150).split(',');
 s+=`<g transform="translate(${tp[0]},${tp[1]})"><g>${rot(4.2)}<path d="M0 0L138 -22L138 22Z" fill="url(#W${H(c)})"/></g><g><animateTransform attributeName="transform" type="scale" values="1 1;.2 1;-1 1;.2 1;1 1" dur="3.4s" repeatCount="indefinite"/><path d="M-20 -4Q0 -26 20 -4Q0 -10 -20 -4Z" fill="${c}" fill-opacity=".5" stroke="#fff" stroke-width="1.4"/></g><path d="M0 0V-18" stroke="#fff" stroke-width="2"/><circle cy="-20" r="3.4" fill="#ff2e63">${an('opacity','1;.1;1',.9)}</circle></g>`;
 s+=halo(+tp[0],+tp[1],26,c,.5);return s},
'Black Market':c=>{_s=121;let s='';
 s+=box(-26,-36,0,3,3,62,c,{nowin:1})+box(26,-36,0,3,3,62,c,{nowin:1});
 s+=box(0,-36,44,34,3,26,'#00f0ff',{nowin:1});
 const sp=P(0,-33,57).split(',');
 s+=`<g transform="translate(${sp[0]},${sp[1]}) matrix(1 .5 0 1 0 0)"><text class="fk" text-anchor="middle" y="0" font-size="17" font-weight="900" fill="#fff" stroke="${c}" stroke-width="1" style="letter-spacing:2px">MARKET</text><text text-anchor="middle" y="-15" font-size="8" font-weight="800" fill="#ffe600">// NO QUESTIONS //</text></g>`;
 const ST=[[-38,24,'#ffe600'],[8,42,'#00f0ff'],[42,6,'#2dff6b']];
 s+=cyl(-6,-4,0,5,2,c,{bands:0});
 ST.forEach(q=>{s+=box(q[0],q[1],0,14,12,16,c,{cols:3,rows:1})+awning(q[0],q[1],17,15,18,c,q[2])});
 const lp=[[-38,24],[8,42],[42,6]];let str='';
 for(let i=0;i<lp.length-1;i++){const a=P(lp[i][0],lp[i][1],22).split(',').map(Number),b=P(lp[i+1][0],lp[i+1][1],22).split(',').map(Number);str+=`<path d="M${a[0]} ${a[1]}Q${(a[0]+b[0])/2} ${(a[1]+b[1])/2+16} ${b[0]} ${b[1]}" stroke="#fff" fill="none" stroke-width="1" opacity=".6"/>`;for(let k=1;k<5;k++){const t=k/5,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t+16*2*t*(1-t);str+=`<circle class="fk" cx="${f(x)}" cy="${f(y)}" r="3.2" fill="${['#ffe600','#00f0ff','#ff2bd6','#2dff6b'][k%4]}" style="animation-delay:-${(i*5+k)*.4}s"/>`}}
 s+=str;
 s+=`<g transform="translate(0,-34)"><g>${an('opacity','1;1',1)}<animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="2.4s" repeatCount="indefinite"/><g><animateTransform attributeName="transform" type="scale" values="1 1;.12 1;1 1" dur="3s" repeatCount="indefinite"/><polygon points="0,-22 17,0 0,22 -17,0" fill="${c}" fill-opacity=".5" stroke="#fff" stroke-width="1.6"/><polygon points="0,-22 17,0 0,6 -17,0" fill="#fff" fill-opacity=".4"/></g></g></g>`;
 s+=`<g><animateMotion dur="7s" repeatCount="indefinite" path="M-100 -70C-40 -110 40 -110 100 -60C40 -20 -40 -20 -100 -70"/><circle r="4.5" fill="#050c26" stroke="${c}" stroke-width="1.6"/><path d="M-9 -4h18" stroke="#fff" stroke-width="1.6"><animate attributeName="opacity" values="1;.2;1" dur=".2s" repeatCount="indefinite"/></path><circle class="fk" cy="2" r="1.8" fill="#ff2e63"/></g>`;return s},
'Nexus HQ':c=>{_s=131;let s='';
 s+=cyl(0,0,0,32,8,c,{bands:0})+plane(0,0,10,ringp(26,c,'4 6',6)+ringp(17,'#ff2bd6','3 5',8,1));
 s+=`<path d="M-14 -8L14 -8L30 -76L-30 -76Z" fill="url(#V${H(c)})"/>`;
 const cr=(fill,stroke,op,dx)=>{const T=[0,-132],B=[0,-52],Lf=[-36,-94],Rt=[36,-94],Fr=[0,-78],Bk=[0,-110],pl=(a,b,d,o,fo)=>`<polygon points="${a} ${b} ${d}" fill="${fill}" fill-opacity="${fo}" stroke="${stroke}" stroke-width="1.2" opacity="${o}"/>`,j=p=>p.join(',');
  return `<g transform="translate(${dx},0)">`+pl(j(T),j(Lf),j(Bk),op*.5,.25)+pl(j(T),j(Bk),j(Rt),op*.5,.18)+pl(j(Lf),j(Bk),j(B),op*.5,.12)+pl(j(Bk),j(Rt),j(B),op*.5,.3)+pl(j(T),j(Lf),j(Fr),op,.55)+pl(j(T),j(Fr),j(Rt),op,.3)+pl(j(Lf),j(Fr),j(B),op,.22)+pl(j(Fr),j(Rt),j(B),op,.6)+`</g>`};
 s+=`<g>${mv('0 0;0 -6;0 0',3)}<g class="fk" style="animation-duration:5s">${cr('#ff2bd6','#ff2bd6',.7,-4)}</g><g class="fk" style="animation-duration:4s;animation-delay:-2s">${cr('#00f0ff','#00f0ff',.7,4)}</g>${cr(c,'#fff',1,0)}${halo(0,-92,60,c,.5)}</g>`;
 s+=plane(0,0,92,ringp(52,c,'3 8',10)+ringp(40,'#fff','1 9',7,1,1.4))+orbit(0,0,92,52,3.2,'#fff',3);
 for(let i=0;i<5;i++)s+=`<text class="bin" x="${-62+i*31}" y="${-20-(i%2)*14}" fill="${i%2?'#ff2bd6':c}" style="animation-delay:-${i*1.3}s">${['10','01','11','00','10'][i]}</text>`;return s}
};

const uniq=['#00f0ff','#2dff6b','#b44dff','#3d7bff','#ffe600','#ff5a1f','#1affd5','#b6ff00','#ff2e63','#8f8bff','#00b3ff','#ff2bd6','#f2ffff'];
let defs='<defs><pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse"><path d="M0 20L40 0L80 20L40 40Z" fill="none" stroke="#00f0ff" stroke-width="1" opacity=".16"/></pattern><radialGradient id="ground"><stop stop-color="#12306a" stop-opacity=".65"/><stop offset=".6" stop-color="#060f2c" stop-opacity=".78"/><stop offset="1" stop-color="#02040c" stop-opacity=".9"/></radialGradient><linearGradient id="mo" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#fff"/><stop offset=".35" stop-color="#ffb000"/><stop offset="1" stop-color="#ff3d00"/></linearGradient>';
uniq.forEach(c=>{const g=H(c);defs+=`<linearGradient id="L${g}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#0b1538"/><stop offset="1" stop-color="${c}" stop-opacity=".5"/></linearGradient><linearGradient id="R${g}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#1a2d6a"/><stop offset="1" stop-color="${c}" stop-opacity=".78"/></linearGradient><linearGradient id="T${g}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c}" stop-opacity=".65"/><stop offset="1" stop-color="#0b1538"/></linearGradient><linearGradient id="C${g}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#0a1330"/><stop offset=".4" stop-color="${c}" stop-opacity=".8"/><stop offset="1" stop-color="#0a1330"/></linearGradient><radialGradient id="G${g}"><stop stop-color="#fff"/><stop offset=".22" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><radialGradient id="D${g}" cx=".5" cy=".75" r=".75"><stop stop-color="${c}" stop-opacity=".08"/><stop offset=".7" stop-color="${c}" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></radialGradient><linearGradient id="W${g}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${c}" stop-opacity=".75"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient><linearGradient id="V${g}" x1="0" y1="1" x2="0" y2="0"><stop stop-color="${c}" stop-opacity=".6"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`});
defs+='</defs>';
const names=Object.keys(ART);const colors=uniq;window.matrixBuildingArt=function(name){let i=names.indexOf(name);if(i<0)return '';let c=colors[i];return '<svg class="matrix-new-art" viewBox="-175 -220 350 320" aria-hidden="true">'+defs+pad(65,c)+ART[name](c)+'</svg>'};window.matrixBuildingInner=function(name){let i=names.indexOf(name),c=colors[i];return pad(65,c)+ART[name](c)};window.matrixBuildingDefs=defs;})();