/* ===== EDIT ME ===== */
const MUSIC_URL = "";  // your MP3 file or URL. Leave empty to use the built-in dreamy synth.
const PHOTOS = [       // add a src for each photo (file path or data URL)
{s:"flowers",src:"",cap:"Flowers, always"},{s:"cake",src:"",cap:"Sweetest Cake"},
 {s:"teddy",src:"",cap:"Teddy Bear"},{s:"balloons",src:"",cap:"Ballons"}];
const TRACKS = [   // our theme songs: title, artist, and an MP3 file or URL

 {title:"Aking Mahal",artist:"Johnoy Danao",src:"./assets/music/track1.mp3"},
 {title:"Ang Balikat at Baywang",artist:"Ian Cruz",src:"./assets/music/track2.mp3"},{title:"She",artist:"Jannabi",src:"./assets/music/track3.mp3"},
 {title:"Apocalypse",artist:"Cigarettes After Sex",src:"./assets/music/track4.mp3"},
 {title:"Sweet",artist:"Cigarettes After Sex",src:"./assets/music/track5.mp3"}];
/* ==================== */
const $=s=>document.querySelector(s),R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[~~(Math.random()*a.length)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let paused=reduce,opened=false,f=0,px=.5,W,H=200,stars,bl,clouds,neon,hearts=[],fw=[],rk=[],cars,nextFw=0,nextTxt=0;
const cv=$('#c'),g=cv.getContext('2d');
const HEART=["XX.XX","XXXXX",".XXX.","..X.."],TINY=["X.X","XXX",".X."];
function spr(p,x,y,c){g.fillStyle=c;p.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]=='X')g.fillRect(~~x+i,~~y+j,1,1)})}
function size(){W=Math.max(180,Math.round(H*innerWidth/innerHeight));cv.width=W;cv.height=H;build()}
function build(){
 stars=Array.from({length:~~(W/3)},()=>({x:R(0,W),y:R(0,H*.6),p:R(0,6),c:Math.random()<.2?'#ffc8e6':'#fff'}));
 bl=[];
 for(let L=0;L<2;L++){let x=-40;while(x<W+60){const w=~~R(14,28)+L*6,h=~~R(L?30:40,L?68:92),b={x,w,h,L,top:H-20-h,win:[]};
  for(let wy=b.top+4;wy<H-26;wy+=6)for(let wx=x+3;wx<x+w-3;wx+=5)b.win.push({x:wx,y:wy,on:Math.random()<.4,c:pick(['#ffe08a','#ff9ccf','#b9e6a0','#c3a6ff'])});
  bl.push(b);x+=w+~~R(1,4)}}
 neon=bl.filter(b=>b.L&&b.w>=22&&b.x>W*.1&&b.x<W*.6)[0]||null;
 clouds=Array.from({length:5},()=>({x:R(0,W),y:R(10,70),w:~~R(14,26),s:R(.5,1.5)*.03}));
 cars=[{x:10,v:.4,c:'#ff9ccf'},{x:W*.6,v:-.3,c:'#b9e6a0'},{x:W*.3,v:.25,c:'#ffe08a'}];
}
const off=L=>(px-.5)*(L?-10:-5)-Math.min(scrollY,1500)*(L?.012:.006);
function update(){
 f++;
 if(f%18==0)for(let i=0;i<4;i++){const b=pick(bl);if(b.win.length)pick(b.win).on^=1}
 clouds.forEach(c=>{c.x+=c.s;if(c.x>W+30)c.x=-30});
 cars.forEach(c=>{c.x+=c.v;if(c.x>W+10)c.x=-10;if(c.x<-10)c.x=W+10});
 if(f%50==0&&hearts.length<(opened?14:6))hearts.push({x:R(0,W),y:H-14,s:R(.15,.4),ph:R(0,6)});
 hearts.forEach(h=>{h.y-=h.s;h.x+=Math.sin(f/30+h.ph)*.15});hearts=hearts.filter(h=>h.y>-4);
 if(opened){if(f>nextFw){launch(Math.random()<.25?'heart':'ring');nextFw=f+R(110,210)}
  if(f>nextTxt){launch('text');nextTxt=f+1500}}
 rk.forEach(r=>{r.y+=r.vy;if(r.y<=r.ty){burst(r.x,r.y,r.type);r.dead=1}else fw.push({x:r.x,y:r.y,vx:0,vy:.2,l:10,c:'#ffe08a',g:0})});rk=rk.filter(r=>!r.dead);
 fw.forEach(p=>{if(p.txt){p.x+=(p.tx-p.x)*.07;p.y+=(p.ty-p.y)*.07;p.l--;if(p.l<50)p.ty+=.5}else{p.x+=p.vx;p.y+=p.vy;p.vx*=.97;p.vy=p.vy*.97+p.g;p.l--}});fw=fw.filter(p=>p.l>0)
}
function launch(type){rk.push({x:type=='text'?W/2:R(W*.15,W*.85),y:H-14,vy:-R(1.9,2.5),ty:type=='text'?H*.28:R(24,80),type})}
function burst(x,y,type){
 const pal=['#ff9ccf','#ffffff','#c3a6ff','#b9e6a0'];
 if(type=='heart')for(let i=0;i<46;i++){const a=i/46*6.283;fw.push({x,y,vx:16*Math.sin(a)**3*.07,vy:-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a))*.07,l:90,c:'#ff7fbf',g:.002})}
 else if(type=='text')textPts().forEach(p=>fw.push({x,y,tx:p[0],ty:p[1],l:280,c:pick(pal),txt:1}));
 else for(let i=0;i<44;i++){const a=R(0,6.283),s=R(.3,1.4);fw.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:R(50,85),c:pick(pal),g:.012})}
}
function textPts(){
 const o=document.createElement('canvas');o.width=W;o.height=40;const x=o.getContext('2d'),s=Math.min(12,W*.9/9);
 x.fillStyle='#fff';x.font='bold '+s+'px monospace';x.textAlign='center';x.textBaseline='middle';
 const d=x.getImageData(0,0,W,40).data,pts=[],ty=H*.14;
 for(let j=0;j<40;j++)for(let i=0;i<W;i++)if(d[(j*W+i)*4+3]>140)pts.push([i,ty+j]);
 return pts;
}
function draw(){
 const cols=['#080b24','#0b1030','#0f1538','#141a42','#1b1f4d','#262256','#35285f','#4a2f6b'],bh=H/cols.length;
 cols.forEach((c,i)=>{g.fillStyle=c;g.fillRect(0,~~(i*bh),W,Math.ceil(bh)+1)});
 stars.forEach(s=>{if(Math.sin(f/20+s.p)>-.3){g.fillStyle=s.c;g.fillRect(~~s.x,~~s.y,1,1)}});
 const mx=W*.8+off(0),my=30;
 for(let r=16;r>9;r-=3){g.fillStyle='rgba(255,230,160,.06)';for(let dy=-r;dy<=r;dy++){const w=~~Math.sqrt(r*r-dy*dy);g.fillRect(mx-w,my+dy,w*2,1)}}
 g.fillStyle='#fff3c4';for(let dy=-9;dy<=9;dy++){const w=~~Math.sqrt(81-dy*dy);g.fillRect(mx-w,my+dy,w*2,1)}
 g.fillStyle='#e8d38e';g.fillRect(mx-4,my-3,3,2);g.fillRect(mx+2,my+2,3,3);g.fillRect(mx-2,my+4,2,2);
 g.fillStyle='rgba(255,200,230,.35)';clouds.forEach(c=>{const x=c.x+off(0);g.fillRect(x,c.y,c.w,3);g.fillRect(x+3,c.y-2,c.w-8,2);g.fillRect(x+2,c.y+3,c.w-4,1)});
 fw.forEach(p=>{g.globalAlpha=Math.min(1,p.l/(p.txt?40:25));g.fillStyle=p.c;g.fillRect(~~p.x,~~p.y,1,1)});g.globalAlpha=1;
 for(let i=0;i<5;i++){g.fillStyle='rgba(255,111,181,'+(.05+i*.02)+')';g.fillRect(0,H-90+i*14,W,14)}
 const bd=L=>bl.filter(b=>b.L==L).forEach(b=>{const x=~~(b.x+off(L));g.fillStyle=L?'#15123b':'#1f1c4c';g.fillRect(x,b.top,b.w,b.h);g.fillStyle=L?'#2a2160':'#2b2766';g.fillRect(x,b.top,b.w,1);
  b.win.forEach(w=>{if(w.on){g.fillStyle=w.c;g.globalAlpha=L?1:.6;g.fillRect(w.x+x-b.x,w.y,2,3)}});g.globalAlpha=1});
 bd(0);
 const tx=((f*.5)%(W+140))-90;g.fillStyle='#3a3480';g.fillRect(0,H-66,W,1);
 for(let i=0;i<5;i++){g.fillStyle='#2d2a63';g.fillRect(tx+i*14,H-72,13,6);g.fillStyle='#ffe08a';g.fillRect(tx+i*14+2,H-71,3,2);g.fillRect(tx+i*14+7,H-71,3,2)}
 bd(1);
 if(neon){const x=neon.x+off(1)+neon.w/2-3,a=.6+.4*Math.sin(f/15);g.fillStyle='rgba(255,111,181,'+a*.2+')';g.fillRect(x-3,neon.top+3,13,10);g.globalAlpha=a;spr(HEART,x,neon.top+6,'#ff6fb5');g.globalAlpha=1}
 g.fillStyle='#1a1538';g.fillRect(0,H-20,W,8);
 cars.forEach(c=>{g.fillStyle=c.c;g.fillRect(c.x,H-18,7,3);g.fillRect(c.x+1,H-20,4,2);g.fillStyle='#fff';g.fillRect(c.v>0?c.x+7:c.x-1,H-17,1,1)});
 for(let x=14;x<W;x+=40){g.fillStyle='#3a3480';g.fillRect(x,H-30,1,11);g.fillStyle='rgba(255,224,138,.2)';g.fillRect(x-4,H-29,9,6);g.fillStyle='#ffe08a';g.fillRect(x-1,H-31,3,2)}
 g.fillStyle='#0a0a22';g.fillRect(0,H-12,W,12);g.fillStyle='#2b2060';g.fillRect(0,H-12,W,1);
 for(let x=0;x<W;x+=8){g.fillRect(x,H-16,1,4)}g.fillRect(0,H-16,W,1);
 const cx=~~(W*.5),y=H-12;
 [[cx-6,'#5a3a2a','#ff9ccf'],[cx+2,'#2a1a3a','#b9e6a0']].forEach(([x,h,b])=>{g.fillStyle=b;g.fillRect(x,y-5,4,5);g.fillStyle='#f6d0b4';g.fillRect(x,y-8,4,3);g.fillStyle=h;g.fillRect(x-.0,y-9,4,2)});
 spr(["X.X","XXX",".X."],cx-1,y-10+Math.sin(f/20),'#ff6fb5');
 hearts.forEach(h=>spr(TINY,h.x,h.y,'#ff9ccf'));
}
function loop(){if(!paused)update();draw();requestAnimationFrame(loop)}
addEventListener('resize',size);addEventListener('pointermove',e=>px=e.clientX/innerWidth,{passive:true});
if(reduce)addEventListener('scroll',draw,{passive:true});
size();loop();

/* ===== Music ===== */
const M={on:false,muted:false,ctx:null,mg:null,el:null,t:0,step:0,
 CH:[[261.6,329.6,392,493.9],[220,261.6,329.6,392],[174.6,220,261.6,329.6],[196,246.9,293.7,392]],AR:[0,1,2,3,2,1,3,2],
 async start(){
  try{
   if(MUSIC_URL||this.track){if(!this.el){this.el=new Audio(MUSIC_URL);this.el.loop=true;this.el.volume=0}
    await this.el.play();let v=0;const i=setInterval(()=>{v=Math.min(.5,v+.025);this.el.volume=v;if(v>=.5)clearInterval(i)},150)}
   else{if(!this.ctx){const c=this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.mg=c.createGain();this.mg.gain.value=0;this.lp=c.createBiquadFilter();this.lp.frequency.value=1400;this.lp.connect(this.mg);this.mg.connect(c.destination);this.t=c.currentTime+.1;setInterval(()=>this.sched(),120)}
    await this.ctx.resume();this.mg.gain.cancelScheduledValues(0);this.mg.gain.setValueAtTime(this.mg.gain.value,this.ctx.currentTime);this.mg.gain.linearRampToValueAtTime(.32,this.ctx.currentTime+3);this.t=Math.max(this.t,this.ctx.currentTime+.1)}
   this.on=true;$('#retry').style.display='none'
  }catch(e){this.on=false;$('#retry').style.display='block'}
  ui()},
 async pause(){this.on=false;if(this.el)this.el.pause();if(this.ctx)await this.ctx.suspend();ui()},
 setMute(m){this.muted=m;if(this.el)this.el.muted=m;if(this.mg)this.mg.gain.setTargetAtTime(m?0:.32,this.ctx.currentTime,.1);ui()},
 note(fr,t,d,v){const c=this.ctx,o=c.createOscillator(),e=c.createGain();o.type='triangle';o.frequency.value=fr;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(v,t+.03);e.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(e);e.connect(this.lp);o.start(t);o.stop(t+d+.05)},
 sched(){if(!this.on||!this.ctx)return;while(this.t<this.ctx.currentTime+.6){const ch=this.CH[(this.step>>3)&3],i=this.step&7;
  if(i==0)this.note(ch[0]/2,this.t,3,.5);this.note(ch[this.AR[i]]*(i==6?2:1),this.t,1.4,.28);this.t+=.45;this.step++}}
};
function ui(){renderCD();$('#pp').textContent=M.on?'❚❚':'▶';$('#pp').setAttribute('aria-pressed',M.on);$('#mu').textContent=M.muted?'✕':'♫';$('#mu').setAttribute('aria-pressed',M.muted)}
$('#pp').onclick=()=>M.on?M.pause():M.start();
$('#mu').onclick=()=>M.setMute(!M.muted);
$('#retry').onclick=()=>M.start();
function mo(){$('#mo').setAttribute('aria-pressed',paused)}
$('#mo').onclick=()=>{paused=!paused;mo()};mo();

/* ===== Opening ===== */
function type(el,txt,sp,cb){if(reduce){el.textContent=txt;cb&&cb();return}let i=0;el.classList.add('cur');const t=setInterval(()=>{el.textContent=txt.slice(0,++i);if(i>=txt.length){clearInterval(t);el.classList.remove('cur');cb&&cb()}},sp)}
$('#open').onclick=()=>{
 opened=true;$('#intro').classList.add('go');document.body.classList.remove('lock');M.start();
 if(!reduce)[0,500,1000,1500,2000].forEach((d,i)=>setTimeout(()=>launch(i==2?'heart':'ring'),d));
 if(!reduce)setTimeout(()=>launch('text'),2800);
 nextFw=f+360;nextTxt=f+1500;
 for(let i=0;i<8;i++)hearts.push({x:R(0,W),y:R(H*.4,H-14),s:R(.15,.4),ph:R(0,6)});
 setTimeout(()=>type($('#h1'),'HAPPY BIRTHDAY, MY BABY! ♡',70,()=>type($('#p1'),'Tonight, the whole city shines a little brighter because it’s your special day. If I could give you the whole world, I would. For now, I made this little world just for you.',32,()=>$('#explore').style.visibility='visible')),reduce?0:900);
};
$('#explore').onclick=()=>$('#letter').scrollIntoView();
setTimeout(()=>{if(!opened){const i=$('#intro');for(let k=0;k<40;k++){const s=document.createElement('i');s.className='st';s.style.cssText='left:'+R(0,100)+'%;top:'+R(0,100)+'%;animation-delay:'+R(0,2)+'s';i.appendChild(s)}}},0);

/* ===== Gallery ===== */
const PAL={p:'#ff9ccf',P:'#ff6fb5',w:'#fff',y:'#ffe08a',g:'#b9e6a0',G:'#6f9a5a',l:'#c3a6ff',b:'#c58b5a',r:'#e0457b',k:'#2a1a3a',c:'#ffe9d2'};
const SP={
 gift:["...yy.yy...","....yyy....","PPPPPyPPPPP","PPPPPyPPPPP",".ppppypppp.",".ppppypppp.",".ppppypppp.",".ppppypppp.",".PPPPyPPPP."],
 flowers:["..PPP.lll..","..PyP.lyl..","..PPP.lll..","...g...g...","...gg.gg...","....gGg....",".....g.....","..ppppppp..","...ppppp...","....ppp...."],
 cake:["......y......","......w......",".wwwwwrwwwww.",".wpwpwpwpwpw.",".ccccccccccc.",".ccccccccccc.",".PPPPPPPPPPP.",".ccccccccccc.",".ccccccccccc.","lllllllllllll"],
 teddy:[".bb.....bb.",".bbbbbbbbb.",".bbkbbbkbb.",".bbbbkbbbb.","..bbbbbbb..",".bbbPPPbbb.","bbbbbbbbbbb","bbbbbbbbbbb",".bbb...bbb."],
 balloons:[".PPP...lll.","PPPPP.lllll","PPPPP.lllll",".PPP...lll.","..P.....l..","..w.....w..","...w...w...","....w.w....",".....w.....",".....w....."],
 heart:[".PPP...PPP.","PPwPPPPPPPP","PPPPPPPPPPP","PPPPPPPPPPP",".PPPPPPPPP.","..PPPPPPP..","...PPPPP...","....PPP....",".....P....."]};
SP.teddy[1]=".bbbbbbbbb.";
const svg=r=>{let s='<svg viewBox="0 0 '+r[0].length+' '+r.length+'" shape-rendering="crispEdges" aria-hidden="true">';r.forEach((q,j)=>{for(let i=0;i<q.length;i++)if(q[i]!='.')s+='<rect x="'+i+'" y="'+j+'" width="1" height="1" fill="'+PAL[q[i]]+'"/>'});return s+'</svg>'};
$('#grid').innerHTML=PHOTOS.map(p=>'<button type="button" class="fr"><span class="ph">'+(p.src?'<img src="'+p.src+'" alt="'+p.cap+'">':svg(SP[p.s]))+'</span><small>'+p.cap+'</small></button>').join('');
$('#grid').onclick=e=>{const b=e.target.closest('.fr');if(!b)return;b.classList.remove('hop');void b.offsetWidth;b.classList.add('hop');if(!paused)launch('ring')};

/* ===== CD playlist ===== */
let cur=-1;
function renderCD(){const t=cur>=0?TRACKS[cur]:null;$('#cd').classList.toggle('on',!!M.on);
 if(M.on||cur<0)$('#np').textContent=t?t.title+(t.artist?' – '+t.artist:''):'City lullaby (default)';
 document.querySelectorAll('.trk').forEach(b=>b.setAttribute('aria-current',+b.dataset.i==cur))}
$('#tl').innerHTML='<button type="button" class="trk" data-i="-1">♪ City lullaby (default)</button>'+TRACKS.map((t,i)=>'<button type="button" class="trk" data-i="'+i+'"><span class="px">'+(i+1)+'</span>'+t.title+(t.artist?' – '+t.artist:'')+(t.src?'':' <em>(add MP3)</em>')+'</button>').join('');
$('#tl').onclick=async e=>{const b=e.target.closest('.trk');if(!b)return;const i=+b.dataset.i;
 if(i<0){M.track=false;cur=-1;if(M.el){M.el.pause();if(MUSIC_URL){M.el.src=MUSIC_URL;M.el.loop=true}}await M.start();return}
 const t=TRACKS[i];if(!t.src){$('#np').textContent='Add an MP3 link for track '+(i+1)+' in the file';return}
 M.track=true;cur=i;if(M.ctx)await M.ctx.suspend();
 if(!M.el){M.el=new Audio();M.el.onended=()=>$('#tl').querySelector('[data-i="'+((cur+1)%TRACKS.length)+'"]').click()}
 M.el.onended=()=>$('#tl').querySelector('[data-i="'+((cur+1)%TRACKS.length)+'"]').click();
 M.el.loop=false;M.el.src=t.src;M.el.volume=.5;M.el.muted=M.muted;
 try{await M.el.play();M.on=true;$('#retry').style.display='none'}catch(err){M.on=false;$('#retry').style.display='block'}
 ui()};

/* ===== Mini-game ===== */
let gOn=false;
$('#gstart').onclick=()=>{if(gOn)return;gOn=true;const c=$('#gc'),x=c.getContext('2d');x.imageSmoothingEnabled=false;let sc=0,bx=120,hs=[],n=0,key=0;$('#score').textContent='Hearts: 0 / 10';
 c.onpointermove=e=>{const r=c.getBoundingClientRect();bx=(e.clientX-r.left)/r.width*240};
 const kd=e=>{if(e.key=='ArrowLeft')key=-3;if(e.key=='ArrowRight')key=3},ku=()=>key=0;addEventListener('keydown',kd);addEventListener('keyup',ku);
 (function tick(){x.fillStyle='#0f1538';x.fillRect(0,0,240,160);bx=Math.max(16,Math.min(224,bx+key));
  if(n++%32==0)hs.push({x:R(8,232),y:-6,v:R(.9,1.6)});
  hs.forEach(h=>{h.y+=h.v;x.fillStyle='#ff6fb5';x.fillRect(h.x-3,h.y,2,2);x.fillRect(h.x+1,h.y,2,2);x.fillRect(h.x-3,h.y+2,6,2);x.fillRect(h.x-2,h.y+4,4,1);x.fillRect(h.x-1,h.y+5,2,1);
   if(h.y>140&&h.y<152&&Math.abs(h.x-bx)<16){h.d=1;sc++;$('#score').textContent='Hearts: '+sc+' / 10'}});
  hs=hs.filter(h=>!h.d&&h.y<162);x.fillStyle='#b9e6a0';x.fillRect(bx-14,148,28,6);x.fillRect(bx-16,146,2,3);x.fillRect(bx+14,146,2,3);
  if(sc>=10){x.fillStyle='#ff9ccf';x.font='12px monospace';x.textAlign='center';x.fillText('You caught my heart ♡',120,80);$('#score').textContent='You caught my heart Baby, I love you ♡';gOn=false;removeEventListener('keydown',kd);removeEventListener('keyup',ku);if(!paused)['heart','ring','heart'].forEach((t,i)=>setTimeout(()=>launch(t),i*500));return}
  requestAnimationFrame(tick)})()};

/* ===== Gift ===== */
$('#gbtn').onclick=()=>{$('#gmsg').style.display='block';if(!paused)['heart','ring','heart','ring'].forEach((t,i)=>setTimeout(()=>launch(t),i*350))};

