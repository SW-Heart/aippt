// Optical research process animations, scoped to the visible slide.
(()=>{
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const scenes=[...document.querySelectorAll('[data-science]')].map(el=>{const canvas=el.querySelector('canvas'),ctx=canvas.getContext('2d');canvas.width=1200;canvas.height=840;return{el,canvas,ctx,kind:el.dataset.science,caption:el.querySelector('.scene-caption'),frame:0}});
const captions={compute:['独立云端环境','GPU 计算与模型调用','隔离环境中执行研究任务'],explore:['分解研究目标','并行尝试候选路径','汇总线索，继续探索'],tools:['检索相关研究','开展计算实验','检验候选结论'],proof:['载入证明依赖','执行形式化检查','返回检查结果'],progress:['跟踪探索分支','定位关键任务节点','受阻时提醒负责人'],team:['围绕同一课题分工','共享研究线索','汇总与审阅阶段成果'],results:['整理研究论证','生成论文与证明材料','保留可检查的研究成果'],question:['明确研究问题','约定目标与验证方式','从边界清晰的课题开始'],pipeline:['构建科学发现的流水线']};
function dot(c,x,y,r=3,color='rgba(147,107,190,.78)'){const g=c.createRadialGradient(x,y,0,x,y,r*4);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.2,color);g.addColorStop(1,'rgba(160,115,210,0)');c.fillStyle=g;c.beginPath();c.arc(x,y,r*4,0,Math.PI*2);c.fill();c.fillStyle=color;c.beginPath();c.arc(x,y,r*.55,0,Math.PI*2);c.fill()}
function curve(c,points,t,offset=0,color='rgba(147,107,190,.65)',width=.8){let start=points[0];c.beginPath();c.moveTo(...start);for(let i=1;i<points.length;i++)c.lineTo(...points[i]);c.strokeStyle='rgba(165,135,195,.13)';c.lineWidth=width;c.stroke();const pos=((t*.12+offset)%1)*(points.length-1),index=Math.floor(pos),f=pos-index,a=points[index],b=points[Math.min(index+1,points.length-1)];dot(c,a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,2.4,color)}
function line(a,b,n=80){return Array.from({length:n},(_,i)=>[a[0]+(b[0]-a[0])*i/(n-1),a[1]+(b[1]-a[1])*i/(n-1)])}
function bez(a,b,h=0){return Array.from({length:100},(_,i)=>{let f=i/99;return[a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-Math.sin(Math.PI*f)*h]})}
function ellipse(cx,cy,rx,ry,angle=0){return Array.from({length:150},(_,i)=>{let a=i/149*Math.PI*2,x=Math.cos(a)*rx,y=Math.sin(a)*ry;return[cx+x*Math.cos(angle)-y*Math.sin(angle),cy+x*Math.sin(angle)+y*Math.cos(angle)]})}
function polar(cx,cy,r,a){return[cx+Math.cos(a)*r,cy+Math.sin(a)*r*.7]}
function screen(c,x,y,w,h,phase){c.save();c.strokeStyle='rgba(144,104,181,.25)';c.lineWidth=.65;for(let i=0;i<7;i++){c.beginPath();c.moveTo(x,y+i*h/6);c.lineTo(x+w,y+i*h/6);c.stroke()}for(let i=0;i<11;i++){c.beginPath();c.moveTo(x+i*w/10,y);c.lineTo(x+i*w/10,y+h);c.stroke()}let pts=Array.from({length:120},(_,i)=>{let f=i/119;return[x+f*w,y+h*.5+Math.sin(f*8+phase)*h*.27]});curve(c,pts,phase,.1,'rgba(140,102,180,.8)',.6);c.restore()}
function draw(s,t){const c=s.ctx;c.clearRect(0,0,1200,840);c.save();c.scale(1.2,1.2);const k=s.kind;
if(k==='compute'){
 for(let j=0;j<4;j++){curve(c,bez([210,470+j*14],[500,425+j*6],40),t,j*.2);curve(c,bez([500,435+j*4],[790,470+j*10],-30),t,.12+j*.2)}
 for(let i=0;i<6;i++)for(let j=0;j<5;j++){const light=(Math.sin(t*3+i*.6+j*.8)+1)/2;if(light>.75)dot(c,455+i*17,410+j*7,1.9,'rgba(167,131,211,.7)')}
 for(const x of[295,703]){const a=(t*.4)%1;c.strokeStyle='rgba(210,240,199,'+(.15+Math.sin(a*Math.PI)*.4)+')';c.lineWidth=1.2;c.beginPath();c.moveTo(x,240+a*170);c.lineTo(x+42,245+a*170);c.stroke()}
}
if(k==='explore'){
 for(let j=0;j<3;j++)curve(c,ellipse(500,316,255-j*28,65+j*17,(j-1)*.22),t,.3*j,'rgba(170,127,218,.8)');
 for(let j=0;j<3;j++){let x=280+j*225,y=175+(j%2)*265;curve(c,bez([500,320],[x,y],40),t,j*.3,'rgba(157,126,196,.45)')}
 dot(c,500,320,5+Math.sin(t)*1.5,'rgba(184,147,232,.55)');
}
if(k==='tools'){
 const a=t*.55,rx=77,ry=110,x=715,y=390;c.save();c.translate(x,y);c.rotate(-.2);c.strokeStyle='rgba(172,131,211,.4)';c.lineWidth=1.6;c.beginPath();c.ellipse(0,0,rx,ry,0,a,a+1.4);c.stroke();dot(c,Math.cos(a)*rx,Math.sin(a)*ry,3);c.restore();
 screen(c,285,409,208,117,t*.5);for(let i=0;i<4;i++)curve(c,bez([330+i*55,235-i*26],[610,330],-15),t,i*.22);
}
if(k==='proof'){
 const phase=(t*.16)%1,y=175+phase*360,alpha=Math.sin(phase*Math.PI)*.55;c.save();c.beginPath();c.rect(190,145,370,420);c.clip();const g=c.createLinearGradient(0,y-15,0,y+15);g.addColorStop(0,'rgba(187,229,174,0)');g.addColorStop(.5,`rgba(179,227,158,${alpha})`);g.addColorStop(1,'rgba(187,229,174,0)');c.fillStyle=g;c.fillRect(180,y-15,390,30);c.strokeStyle=`rgba(157,197,137,${alpha+.1})`;c.beginPath();c.moveTo(190,y);c.lineTo(560,y+5);c.stroke();c.restore();
 for(let i=0;i<4;i++)curve(c,bez([310+i*42,320+i*17],[737,395],75-i*20),t,i*.2,'rgba(172,207,149,.6)');
 dot(c,737,392,4+Math.sin(t*2), 'rgba(188,222,157,.6)');
}
if(k==='progress'){
 const paths=[[[500,565],[500,435],[325,350],[286,243],[250,190]],[[500,565],[500,430],[500,345],[520,245],[520,190]],[[500,565],[640,470],[710,376],[735,295]],[[500,565],[370,464],[286,425],[250,370]]];
 paths.forEach((arr,i)=>{let ps=[];for(let j=1;j<arr.length;j++)ps.push(...bez(arr[j-1],arr[j],8));curve(c,ps,t,i*.21,i===2?'rgba(206,156,89,.75)':'rgba(153,120,199,.7)')});
 s.el.classList.toggle('signal',(t%12)>7);if((t%12)>7)dot(c,735,295,4+Math.sin(t*4),'rgba(218,167,105,.7)');
}
if(k==='team'){
 const pts=[[330,200],[680,200],[295,430],[710,430]];pts.forEach((p,i)=>curve(c,bez(p,[500,340],20),t,i*.22,'rgba(172,133,208,.65)'));curve(c,ellipse(500,360,274,119),t,0,'rgba(173,137,212,.5)');
 for(let i=0;i<4;i++){let f=(t*.12+i*.25)%1,x=pts[i][0]+(500-pts[i][0])*f,y=pts[i][1]+(340-pts[i][1])*f;c.strokeStyle='rgba(166,135,196,'+(Math.sin(f*Math.PI)*.65)+')';c.lineWidth=1;c.strokeRect(x-8,y-10,16,20)}
}
if(k==='results'){
 for(let i=0;i<12;i++){let f=((t*.14+i*.055)%1),x=345+i%3*27,y=315+i*11;c.strokeStyle='rgba(157,128,179,'+(Math.sin(f*Math.PI)*.32)+')';c.lineWidth=1;c.beginPath();c.moveTo(x,y);c.lineTo(x+70*f,y+16*f);c.stroke()}
 for(let j=0;j<3;j++)curve(c,bez([470,420+j*25],[735,510],30),t,j*.3,'rgba(157,193,121,.6)');dot(c,739,510,4+Math.sin(t*1.3),'rgba(185,214,150,.6)');
}
if(k==='question'){
 for(let j=0;j<3;j++){let pts=Array.from({length:180},(_,i)=>{let a=i/179*Math.PI*2,x=(130+40*Math.cos(3*a))*Math.cos(2*a),y=(115+40*Math.cos(3*a))*Math.sin(2*a);return[500+x,270+y*.8]});curve(c,pts,t,j*.33,'rgba(162,118,219,.7)')}
 screen(c,280,528,130,60,t*.35);
}
if(k==='pipeline'){
 const positions=[[230,374],[445,375],[645,380],[795,395]];for(let i=1;i<positions.length;i++)curve(c,bez(positions[i-1],positions[i],-20),t,i*.2,'rgba(165,128,212,.7)');
}
c.restore();s.frame++;
const list=captions[k]||[];const msg=list[Math.floor(t/4)%list.length];if(s.caption.textContent!==msg)s.caption.textContent=msg;
}
let last=-1;function animate(now){requestAnimationFrame(animate);if(document.hidden||now-last<(reduced?90:32))return;last=now;for(const s of scenes)if(s.el.closest('.slide').classList.contains('active'))draw(s,now/1000*(reduced?.35:1))}requestAnimationFrame(animate);
const viewObserver=new MutationObserver(()=>{for(const s of scenes)if(!s.el.closest('.slide').classList.contains('active'))s.ctx.clearRect(0,0,1200,840)});viewObserver.observe(document.getElementById('stage'),{subtree:true,attributes:true,attributeFilter:['class']});
})();
