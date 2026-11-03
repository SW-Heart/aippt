import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const ROOT=fileURLToPath(new URL('../',import.meta.url));
const OUT=ROOT;
const e=(t,x,y,w,s=26,c='',extra='')=>`<div class="e ${c}" style="left:${x}px;top:${y}px;width:${w}px;font-size:${s}px;${extra}">${t}</div>`;
const art=(svg,x,y,w,h,c='')=>`<div class="art ${c}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${svg}</div>`;
const svg=(content,w=700,h=480)=>`<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" fill="none">${content}</svg>`;
const path=(d,col='#8076F7',sw=2,opacity=1)=>`<path d="${d}" stroke="${col}" stroke-width="${sw}" opacity="${opacity}"/>`;
const rect=(x,y,w,h,fill='#FFFFFF',r=20,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const circle=(x,y,r,fill,stroke='none',sw=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const brand=()=>'';
const title=(a,b='')=>e(a,72,112,1296,49,'title')+(b?e(b,74,183,1280,25,'muted'): '');
const page=(name,body,theme='light')=>({name,body,theme});
let pages=[];
const icon=(kind,color='#6254EF')=>{
 const d={cloud:'M18 48h34a13 13 0 0 0 0-26 20 20 0 0 0-38-1 14 14 0 0 0 4 27Z',search:'M45 44l15 15M49 29a20 20 0 1 1-40 0 20 20 0 0 1 40 0Z',chip:'M18 18h32v32H18zM26 26h16v16H26zM25 9v9m16-9v9M25 50v9m16-9v9M9 25h9m-9 16h9m32-16h9m-9 16h9',check:'M14 34l14 14 29-31',file:'M16 8h28l12 12v41H16zM44 8v15h12M24 35h24M24 44h19M24 53h23',people:'M26 28a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-17 30V46c0-17 34-17 34 0v12M46 10c14 1 14 20 0 21m5 7c10 0 14 9 14 19',tree:'M33 10v18m-20 0h40M13 28v18m40-18v18M26 4h14v12H26zM6 46h14v13H6zm40 0h14v13H46z'};
 return svg(`<path d="${d[kind]||d.file}" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`,70,70);
};
// 1
const productImage=(await fs.readFile(ROOT+'assets/product.png')).toString('base64');
const factorySvg=await fs.readFile(ROOT+'assets/factory.svg','utf8');
let pipeline=`<div class="factory-scene">${factorySvg}</div><button class="animation-toggle" aria-label="暂停流程动画">暂停动画</button>`;
pages.push(page('产品愿景',
 e('矩阵工坊',76,102,580,76,'hero-title')+
 e('构建科学发现的流水线',81,222,620,37,'purple strong')+
 e('让 AI 持续探索，让研究者专注发现',83,316,540,24,'muted')+
 `<button class="product-display" aria-label="放大查看产品原图"><img src="data:image/png;base64,${productImage}" alt="矩阵工坊产品展示" width="2940" height="1600"><span class="zoom-caption">查看原图 ↗</span></button>`+
 pipeline,'light'));
// 2
const roleDiagram=svg(`<defs><linearGradient id="rolepaper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#FFFFFF"/><stop offset="1" stop-color="#ECE5FA"/></linearGradient></defs>
<path d="M0 139h128M210 139h72M410 139h72M610 139h72" stroke="#CDC2E1" stroke-width="1.5"/>
<path d="m118 134 9 5-9 5m144-10 9 5-9 5m190-10 9 5-9 5m190-10 9 5-9 5" stroke="#AB9ABE" stroke-width="1.5"/>
<g transform="translate(34 24)"><rect x="7" y="8" width="64" height="80" rx="6" fill="#E3D9F1"/><rect width="64" height="80" rx="6" fill="url(#rolepaper)" stroke="#C8BAD9"/><path d="M14 22h34M14 33h36M14 44h25" stroke="#BDAAD0" stroke-width="3"/><circle cx="54" cy="62" r="19" fill="#F8F5FC" stroke="#9E83BD" stroke-width="2"/><path d="m67 77 13 13" stroke="#9E83BD" stroke-width="4"/></g>
<g transform="translate(225 25)"><path d="M8 64 33 22l34 49 36-60M8 64l59 7m-34-49 70-11" stroke="#BEABD5" stroke-width="2"/><g fill="#E9DDF5" stroke="#A98AC5"><circle cx="8" cy="64" r="10"/><circle cx="33" cy="22" r="10"/><circle cx="67" cy="71" r="10"/><circle cx="103" cy="11" r="10"/></g><circle cx="67" cy="71" r="4" fill="#9975B6"/></g>
<g transform="translate(440 19)"><path d="M0 0h54l17 17v76H0Z" fill="url(#rolepaper)" stroke="#BEACD1"/><path d="M54 0v17h17M13 31h43M13 42h32" stroke="#BFACD0" stroke-width="2"/><circle cx="57" cy="73" r="23" fill="#E8EEF0" stroke="#A8BBC3"/><path d="m45 73 9 9 17-21" stroke="#76969A" stroke-width="3" stroke-linecap="round"/></g>
<g transform="translate(643 22)"><rect x="10" y="8" width="63" height="87" rx="5" fill="#E0D3EF"/><rect width="63" height="87" rx="5" fill="url(#rolepaper)" stroke="#C4B1D4"/><path d="M13 20h36M13 39h36M13 49h36M13 59h36M13 69h24" stroke="#B49BC9" stroke-width="2.5"/><path d="M13 28h26" stroke="#9974B3" stroke-width="3"/></g>`,760,165);
let roles=e('帮助科研工作者，借助 AI',74,65,1290,48,'title')+e('更好地完成科研任务',74,136,1290,48,'purple strong')+
 `<div class="roles-ai-surface"></div>`+
 e('科研工作者',88,280,330,33,'strong')+e('定义问题',88,356,330,26,'strong')+e('明确目标、假设与约束',88,400,330,23,'muted')+e('引导探索',88,465,330,26,'strong')+e('在关键节点补充指导与判断',88,509,355,23,'muted')+e('审阅成果',88,574,330,26,'strong')+e('评估结论与证明质量',88,618,330,23,'muted')+
 e('矩阵工坊 AI',620,280,650,33,'strong')+e('围绕同一课题，持续检索、探索、计算与验证',620,337,700,23,'muted')+
 art(roleDiagram,620,400,730,158)+
 e('检索与拆解',620,565,180,25,'strong')+e('相关工作与研究分支',620,609,190,20,'muted')+
 e('探索与计算',815,565,180,25,'strong')+e('证明尝试与计算实验',815,609,190,20,'muted')+
 e('论证与验证',1010,565,180,25,'strong')+e('推导核查与验证',1010,609,190,20,'muted')+
 e('成果整理',1205,565,160,25,'strong')+e('论文与验证文件',1205,609,175,20,'muted')+
 art(svg('<path d="M0 0h95m-9-6 9 6-9 6M95 112H0m9-6-9 6 9 6" stroke="#B09BC9" stroke-width="1.7"/>',100,125),467,404,100,125)+e('课题与指导',462,366,113,18,'role-hint center')+e('进展与成果',462,539,113,18,'role-hint center')+
 e('研究者掌握方向与判断，AI 承担持续执行',88,682,1230,25,'role-summary');
pages.push(page('我们做什么',roles));
// 4
let problemArt=svg(`<defs><linearGradient id="gapGrad" x2="1" y2="1"><stop stop-color="#E5DCF1"/><stop offset="1" stop-color="#C4B0DB"/></linearGradient></defs>
<path d="M52 53h200l62 30H114Z" fill="#F8F4FC" stroke="#CCBCDD"/><path d="M114 83h200v54H114Z" fill="url(#gapGrad)"/><path d="M52 53 114 83v54l-62-30Z" fill="#D6C5E4"/>
<path d="M52 309h200l62 30H114Z" fill="#F8F4FC" stroke="#CCBCDD"/><path d="M114 339h200v36H114Z" fill="#BCACCE"/><path d="M52 309 114 339v36l-62-30Z" fill="#D6C5E4"/>
<path d="M210 155v40m0 44v42" stroke="#B8A3CC" stroke-width="2" stroke-dasharray="5 7"/><path d="m202 274 8 9 8-9" stroke="#B8A3CC" stroke-width="2"/>

</svg>`,370,405);
let problems=title('AI科研的最后一公里','直接使用 Codex / Claude，科研工作流中的配套环节仍需自行组织')+
 art(problemArt,60,259,370,405)+e('通用 AI 能力',125,342,280,27,'strong center')+e('科研工作流的落地缺口',74,465,340,23,'problem-accent center')+e('可交付的科研成果',109,599,290,23,'strong center');
const gaps=[
 ['环境与算力','软件环境、GPU 与数据隔离','需要自行准备和管理','cloud'],
 ['长周期探索','任务拆解、持续调度和中途干预','需要额外组织','chip'],
 ['专业工具','学术检索、计算仿真等工具','需要逐项接入研究流程','search'],
 ['证明验证','生成的推导仍需严格检查','Lean4 依赖与验证流程需另行准备','check'],
 ['科研进度','探索分支和关键节点需持续追踪','受阻后仍需及时发现并介入','tree'],
 ['团队协作','多人分工、资料共享与成果汇总','需要统一的课题工作空间','people']
];
gaps.forEach(([name,line1,line2,type],i)=>{const x=490+(i%2)*455,y=271+Math.floor(i/2)*139;problems+=art(icon(type,'#9E86B3'),x,y+2,35,35)+e(name,x+53,y,355,29,'strong')+e(line1,x+53,y+49,355,22,'muted')+e(line2,x+53,y+83,355,22,'muted');});
problems+=e('讨论口径：通用 Agent 配合自行组织科研流程，具体能力取决于版本、部署与工具配置',490,714,875,17,'muted');
pages.push(page('AI科研的最后一公里',problems));

const researchAssets={};
for(const name of ['compute','explore','tools','proof','progress','team','results','question','pipeline']){
 researchAssets[name]=(await fs.readFile(ROOT+'assets/scenes/'+name+'.webp')).toString('base64');
}
function scientificScene(name,x,y,w,h){return `<div class="science-scene science-${name}" data-science="${name}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><img class="science-object" src="data:image/webp;base64,${researchAssets[name]}" alt="${{compute:'AI 科研计算环境',explore:'数学研究的并行探索',tools:'学术检索与计算实验',proof:'形式化证明验证',progress:'研究分支与进度',team:'协同科研工作空间',results:'论文与证明材料',question:'数学研究问题',pipeline:'科学发现流水线'}[name]}"><canvas aria-hidden="true"></canvas>${name==='progress'?'<div class="guidance-signal">需要研究指导</div>':''}<div class="scene-caption" aria-live="off"></div></div>`;}
const featureRow=(s1,s2,y,x=80,w=515)=>e(s1,x,y,w,29,'strong')+e(s2,x,y+48,w,23,'muted');
pages.push(page('开箱即用',title('科研环境，打开即用','软件、算力与模型准备就绪，研究者直接进入课题')+
 featureRow('独立云端沙盒','无需预装软件，Agent 在独立环境中运行',285)+
 featureRow('高性能 GPU 计算环境','为计算密集的研究任务提供算力',420)+
 featureRow('GPT、Claude 等模型','根据研究需要，自由选择模型',555)+
 scientificScene('compute',691,225,693,502)+e('研究数据隐私隔离',858,690,370,22,'purple center')));
pages.push(page('持续探索',title('长时间探索，持续推进研究','监督者协调任务，启发式数学探索 Agent 尝试不同研究路径')+
 e('几十天',78,290,480,86,'purple strong')+e('长时间持续运行',83,402,480,34,'strong')+
 featureRow('自主探索与计算','围绕研究目标，持续尝试候选路径',507,83,480)+
 e('研究者可在运行中插入指导',83,651,530,25,'purple')+
 scientificScene('explore',637,224,762,503)));
pages.push(page('科研工具',title('专业工具，贯穿探索过程','学术检索提供依据，计算实验帮助检验研究思路')+
 featureRow('学术搜索','检索论文、已有结果与证明线索',307,82,530)+
 featureRow('计算与仿真','通过特殊情形、数值实验检验候选结论',467,82,560)+
 e('把文献证据与计算实验纳入同一课题',83,649,570,24,'purple')+
 scientificScene('tools',656,216,729,513)));
const evidenceAssets={};
for(const name of ['board','tree','review','files','acceptance','summary','lean-acceptance','lean-delivery','paper-proof','paper-abstract','tree-complete'])evidenceAssets[name]='data:image/png;base64,'+(await fs.readFile(ROOT+'assets/screenshots/'+name+'.png')).toString('base64');
function evidenceGallery(key,items){
 const panel=([name,label,position],i)=>`<button class="evidence-view" data-panel="${i}" aria-label="放大查看${label}"><img src="${evidenceAssets[name]}" alt="${label}" style="object-position:${position||'top'}"><span class="evidence-label">${label}</span></button>`;
 return `<div class="evidence-gallery ${items.length>1?'dual':''}" data-evidence-gallery="${key}"><div class="evidence-panels">${items.slice(0,2).map(panel).join('')}</div><div class="evidence-options ${items.length<=2?'no-switch':''}" role="tablist" aria-label="${key}">${items.map(([name,label,position],i)=>`<button class="evidence-option ${i===0?'selected':''}" role="tab" ${i%2?'hidden':''} aria-selected="${i===0}" data-source="${evidenceAssets[name]}" data-alt="${label}" data-position="${position||'top'}">${i%2===0&&items[i+1]?label+' / '+items[i+1][1]:label}</button>`).join('')}</div></div>`;
}
pages.push(page('Lean4 验证',title('Lean4 形式化验证','自建 Lean4 库，支持证明检查、成果交付与独立复现')+
 evidenceGallery('Lean4 形式化验证',[['lean-acceptance','形式化验证验收结果','top'],['lean-delivery','交付文件与复现方式','top']])+
 e('可复用的 Lean4 库',75,672,410,24,'strong')+
 e('整合积累，提供预编译库',75,711,410,19,'muted')+
 e('逐项检查证明义务',520,672,410,24,'strong')+
 e('图示任务 61 项全部通过',520,711,410,19,'muted')+
 e('完整交付与独立复现',965,672,410,24,'strong')+
 e('Wilson 定理形式化验证示例',965,711,410,19,'muted')));
pages.push(page('进度与审核',title('探索过程可见，关键节点有人把关','节点树呈现研究分支，重要进展主动 @ 研究者审核')+
 evidenceGallery('进度与审核',[['tree','研究分支探索','center'],['tree-complete','完整任务节点树','center'],['review','关键节点 @ 用户审核','center']])+
 featureRow('探索节点树','分支、子任务与状态可见',288,1090,290)+
 featureRow('关键节点提醒','主动 @ 用户，进入审核环节',438,1090,290)+
 featureRow('研究者及时介入','基于阶段材料判断后续方向',588,1090,290)));
pages.push(page('团队协作',title('研究者与 Agent，在同一面板协作','通过工作看板组织研究任务，持续跟进不同方向的进展')+
 evidenceGallery('协作面板',[['board','产品协作面板','top']])+
 featureRow('课题统一管理','围绕同一研究项目组织任务',288,1090,290)+
 featureRow('研究状态可见','待办、进行中与审核中',438,1090,290)+
 featureRow('人机协同推进','研究者与 Agent 协同推进',588,1090,290)));
pages.push(page('形成研究结论',title('形成研究结论，保留论证与证据','已证明多个业界多年未解的猜想 / 问题')+
 featureRow('整理完整论证','明确结论、适用范围与证明路径',313,83,550)+
 featureRow('沉淀研究证据','汇总推导与计算材料，进入验证环节',495,83,550)+
 scientificScene('results',666,221,714,506)));
pages.push(page('成果交付',title('每次交付，都可查看、可复现','Agent 输出研究文件、复现材料与监督记录，保留可检查的研究过程')+
 evidenceGallery('成果与复现',[['paper-abstract','论文摘要与引言','top'],['paper-proof','论文正文与证明','top'],['files','交付与复现','bottom'],['acceptance','验收记录','top']])+
 featureRow('论文与研究材料','摘要、研究论证与证明细节',281,1090,290)+
 featureRow('复现代码与说明','代码、测试与复现环境说明',418,1090,290)+
 featureRow('监督与证据材料','节点树、阶段观察与验收',555,1090,290)+
 e('图示案例：Wilson 定理任务交付',1090,689,290,17,'muted')));
pages.push(page('完整任务总结',title('完整任务总结，研究过程可追溯','Agent 汇总研究论证、计算检查、任务执行与交付结果')+
 evidenceGallery('任务总结',[['summary','完整任务监督与交付报告','top']])+
 featureRow('完成结果与证据边界','明确已完成工作与结论边界',282,1090,290)+
 featureRow('审查与核验记录','记录检查过程与材料来源',429,1090,290)+
 featureRow('过程回顾与交付索引','探索、修复与交付文件索引',576,1090,290)+
 e('Wilson 定理为经典定理，此处展示任务流程',1090,697,290,15,'muted')));
let trials=title('从一个明确的研究问题开始','明确研究目标、已有材料、约束条件与预期交付');
const tasks=[['猜想与证明路径探索','尝试候选思路，推进研究论证','search'],['计算实验与反例搜索','检验特殊情形与候选结论','chip'],['已有推导的形式化验证','将证明整理为可检查文件','check'],['论文与证明材料整理','归纳研究过程与阶段结果','file']];
tasks.forEach(([t,d,k],i)=>{const y=284+i*102;trials+=art(icon(k,'#A28AB6'),81,y+5,36,36)+e(t,139,y,600,27,'strong')+e(d,139,y+43,600,21,'muted');});
trials+=scientificScene('question',757,208,635,400)+e('课题定义',850,617,440,25,'strong')+e('明确问题、已有结果与阶段验证方式',850,659,510,21,'muted')+e('指定负责人，明确约束与预期交付',850,694,510,21,'muted');
pages.push(page('定义研究问题',trials));
pages.push(page('机构申请',
 e('构建科学发现的',81,156,1120,67,'strong')+e('流水线',81,250,1120,94,'purple strong')+
 e('矩阵工坊，目前仅支持机构申请使用',86,411,1100,31,'strong')+
 scientificScene('pipeline',655,283,745,416)+
 e('申请沟通建议提供：机构与团队信息、研究方向、拟探索课题及算力需求',85,704,1270,22,'muted')));

const researchOrder=['产品愿景','我们做什么','AI科研的最后一公里','定义研究问题','开箱即用','团队协作','科研工具','持续探索','进度与审核','形成研究结论','Lean4 验证','成果交付','完整任务总结','机构申请'];
const pageByName=new Map(pages.map(p=>[p.name,p]));
pages=researchOrder.map(name=>{const item=pageByName.get(name);if(!item)throw new Error('Missing page: '+name);return item});

for(let i=1;i<pages.length;i++)pages[i].body=pages[i].body.replace(/style="([^"]*)"/g,(all,style)=>{
 const match=style.match(/(?:^|;)top:([\d.]+)px/);if(!match)return all;
 const y=Number(match[1]);const top=y<220?y-(i===1?17:64):170+(y-220)*1.1;
 style=style.replace(/top:[\d.]+px/,'top:'+top.toFixed(1)+'px');
 if(y>=220)style=style.replace(/height:([\d.]+)px/,(_,h)=>'height:'+(Number(h)*1.1).toFixed(1)+'px');
 return 'style="'+style+'"';
});
const densityCss=`
.evidence-view{display:grid!important;grid-template-rows:30px minmax(0,1fr);padding:8px!important;gap:3px;text-align:left}.evidence-view[hidden],.evidence-option[hidden],.evidence-options.no-switch{display:none!important}.evidence-view img{grid-row:2;object-fit:contain!important;object-position:center!important;min-height:0;min-width:0}.evidence-label{position:static!important;grid-row:1;background:transparent!important;border:0!important;padding:2px 6px!important;max-width:none!important}.evidence-zoom{position:static!important;grid-row:3;justify-self:end;padding:4px 8px!important;font-size:13px!important;background:transparent!important;border:0!important}
.slide[data-page-kind="Lean4 验证"] .evidence-gallery{width:1296px!important;height:476px!important;top:168px!important}.slide[data-page-kind="Lean4 验证"] .evidence-panels,.slide[data-page-kind="Lean4 验证"] .evidence-view{height:476px!important}

.evidence-gallery{top:178px!important;height:548px!important}.evidence-panels{display:grid;grid-template-columns:1fr;gap:14px;height:500px}.evidence-gallery.dual .evidence-panels{grid-template-columns:1fr 1fr}.evidence-view{position:relative!important;inset:auto!important;width:100%!important;height:500px!important;box-shadow:0 8px 24px #25202E12!important}.evidence-label{position:absolute;top:12px;left:12px;max-width:90%;padding:7px 11px;background:#252522E8;border:1px solid #FFFFFF26;color:#F2F0EB;border-radius:6px;font-size:15px}.evidence-view img{object-position:center}.evidence-options{height:36px!important}.evidence-option{font-size:15px!important;padding:6px 10px!important}.roles-ai-surface{top:205px!important;height:452px!important}.trial-brief{top:220px!important;height:463px!important}.refine-tool{top:209px!important;height:519px!important}.result-divider{top:249px!important;height:411px!important}
#slide-1 .hero-title{top:62px!important}#slide-1 .e.purple{top:182px!important}#slide-1 .e.muted{top:276px!important}
`;
const css=`
.evidence-gallery{position:absolute;left:74px;top:251px;width:970px;height:469px}.evidence-view{position:absolute;inset:0 0 43px 0;width:100%;height:426px;padding:0;border:1px solid #D8CFDE;background:#252522;border-radius:13px;box-shadow:0 15px 35px #25202E18;overflow:hidden;cursor:zoom-in}.evidence-view img{display:block;width:100%;height:100%;object-fit:cover}.evidence-zoom{position:absolute;bottom:12px;right:13px;padding:8px 12px;border:1px solid #FFFFFF24;background:#252522DF;backdrop-filter:blur(10px);border-radius:7px;font-size:14px;color:#E9E7E1}.evidence-options{position:absolute;left:0;right:0;bottom:0;display:flex;gap:9px;align-items:center;height:32px}.evidence-option{border:1px solid transparent;padding:6px 13px;background:transparent;color:#8F7E9A;border-radius:7px;font-size:16px;line-height:1.25}.evidence-option.selected{background:#EBE3F2;border-color:#DFD1EA;color:#73558D}.evidence-option:hover{background:#EEE8F4}.image-dialog img{width:auto!important;max-width:none;height:auto}.image-dialog.fit img{width:100%!important}

.science-scene{position:absolute;isolation:isolate;z-index:1;pointer-events:none}.science-object{position:absolute;top:0;left:50%;display:block;width:auto;height:100%;transform:translateX(-50%);object-fit:contain;mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent),linear-gradient(to bottom,transparent,#000 7%,#000 93%,transparent);mask-composite:intersect;-webkit-mask-image:linear-gradient(to right,transparent,#000 7%,#000 93%,transparent),linear-gradient(to bottom,transparent,#000 7%,#000 93%,transparent);-webkit-mask-composite:source-in}.science-scene canvas{position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:normal;opacity:.85}.scene-caption{position:absolute;left:8%;right:8%;bottom:1%;text-align:center;color:#8A779A;font-size:17px;letter-spacing:.08em;opacity:.82}.guidance-signal{position:absolute;right:7%;top:42%;padding:10px 16px;border:1px solid #D5B79A;border-radius:9px;background:#FBF5EFF0;color:#A67B53;font-size:18px;opacity:0;transform:translateY(5px);transition:opacity .5s,transform .5s}.science-progress.signal .guidance-signal{opacity:1;transform:translateY(0)}.science-pipeline .scene-caption,.science-progress .scene-caption,.science-question .scene-caption,.science-compute .scene-caption{display:none}.slide:not(.active) .science-scene{visibility:hidden}

.slide:not(#slide-1){background:#F8F7FB}.slide:not(#slide-1):before{background:none}.slide .purple{color:#79588F}.refine-tool{position:absolute;top:255px;width:610px;height:472px;border-radius:24px;background:linear-gradient(140deg,#F0E9F6,#F4EFF8);border:1px solid #E5DBEE}.refine-tool.left{left:74px}.refine-tool.right{left:756px}.result-divider{position:absolute;left:720px;top:292px;width:1px;height:374px;background:#DED3E8}.trial-brief{position:absolute;left:876px;top:265px;width:496px;height:421px;border-radius:22px;background:#F0EAF5;border:1px solid #E4D9ED}.closing-factory{position:absolute;left:430px;top:441px;width:960px;height:240px;opacity:.87}.closing-factory svg{width:100%;height:100%}

#slide-3{background:#F8F7FB}#slide-3:before{background:none}.problem-accent{color:#A77B58}

#slide-2{background:#F8F7FB}#slide-2:before{background:none}#slide-2 .footer:before{display:none}#slide-2 .purple{color:#75558F}.roles-ai-surface{position:absolute;left:588px;top:252px;width:800px;height:411px;border-radius:22px;background:linear-gradient(120deg,#EEE8F5,#F3EFF8);border:1px solid #E6DDEE}.role-hint{color:#9C85AF}.role-summary{color:#7C688C;border-top:1px solid #DDD3E5;padding-top:17px}

#slide-1{background:#F7F5FA}#slide-1:before{background:radial-gradient(ellipse at 72% 0%,#E6DFEF88,transparent 65%)}#slide-1 .footer{display:none}#slide-1 .purple{color:#72548F}#slide-1 .product-display{left:700px!important;top:52px!important;width:666px!important;height:363px!important;border-radius:12px;box-shadow:0 18px 45px #47325114,0 0 0 1px #DDD3E5}#slide-1 .animation-toggle{top:411px;right:73px;font-size:13px;color:#8F829A}.factory-scene{position:absolute;left:28px;top:417px;width:1384px;height:346px}.factory-scene svg{width:100%;height:100%;overflow:visible}.factory-scene.paused *{animation-play-state:paused!important}.belt-dashes{animation:beltRun 1.3s linear infinite}.research-orbit{transform-origin:482px 140px;animation:orbital 8s ease-in-out infinite}.formula{animation:formFloat 4s ease-in-out infinite alternate}.f2{animation-delay:-2s}.scan-beam{animation:scanProcess 3s ease-in-out infinite}.verified-tick{stroke-dasharray:40;stroke-dashoffset:40;animation:confirmProof 5s ease infinite}.question-card{animation:questionFeed 4s ease-in-out infinite}.machine-led{animation:ledGlow 1.5s ease-in-out infinite alternate}.paper-stack{animation:paperOutput 6s ease-in-out infinite}.travelling-paper{animation:documentTravel 14s linear infinite}@keyframes beltRun{to{stroke-dashoffset:-50}}@keyframes orbital{0%,100%{transform:translateY(0) rotate(-5deg)}50%{transform:translateY(-6px) rotate(6deg)}}@keyframes formFloat{to{transform:translateY(-9px);opacity:.4}}@keyframes scanProcess{0%,100%{transform:translateY(-12px);opacity:0}15%,80%{opacity:.8}90%{transform:translateY(65px);opacity:0}}@keyframes confirmProof{0%,40%{stroke-dashoffset:40}60%,95%{stroke-dashoffset:0}100%{stroke-dashoffset:40}}@keyframes questionFeed{0%,100%{opacity:1}65%{opacity:.35}}@keyframes ledGlow{to{opacity:.35}}@keyframes paperOutput{0%,75%,100%{transform:translateY(0)}85%{transform:translateY(-7px)}}@keyframes documentTravel{0%{transform:translateX(-30px);opacity:0}5%{opacity:1}25%{transform:translateX(230px);opacity:.1}40%{transform:translateX(380px);opacity:1}62%{transform:translateX(610px);opacity:.1}75%{opacity:1}95%{transform:translateX(950px);opacity:1}100%{transform:translateX(980px);opacity:0}}@media(prefers-reduced-motion:reduce){.factory-scene *{animation-duration:24s!important}}

.product-display{left:554px!important;top:80px!important;width:814px!important;height:444px!important;transform:none!important;border:0;padding:0;cursor:zoom-in;text-align:left}.product-display img{image-rendering:auto}.zoom-caption{position:absolute;bottom:12px;right:16px;background:#FFFFFFF2;color:#51427E;padding:8px 13px;border:1px solid #DDD7E9;border-radius:8px;font-size:15px;opacity:0;transition:opacity .2s}.product-display:hover .zoom-caption,.product-display:focus-visible .zoom-caption{opacity:1}.image-dialog{border:0;padding:0;background:#F9F9FC;width:96vw;max-width:none;height:92vh;max-height:none;border-radius:14px;overflow:auto}.image-dialog::backdrop{background:#17162BD9;backdrop-filter:blur(8px)}.image-dialog img{display:block;width:2940px;max-width:none;height:auto}.image-dialog .close-image{position:fixed;right:4vw;top:6vh;z-index:99;background:#26223D;color:white;border:0;border-radius:50%;width:44px;height:44px;font-size:26px}.image-dialog .fit-image{position:fixed;left:4vw;top:6vh;z-index:99;background:#26223D;color:white;border:0;border-radius:9px;padding:12px 16px}.image-dialog.fit img{width:100%;height:auto}
.pipeline-status{position:absolute;top:543px;left:420px;width:600px;text-align:center;font-size:20px;color:#796A9D}.animation-toggle{position:absolute;top:544px;right:76px;background:none;border:0;color:#7D738C;font-size:15px;padding:4px 10px}.pipeline-progress{position:absolute;left:140px;top:602px;height:3px;width:0;background:#7962DE;z-index:1}.research-sheet{position:absolute;left:115px;top:579px;width:52px;height:52px;background:#FFFFFF;border:1px solid #9A83DE;border-radius:8px;box-shadow:0 5px 18px #5B3E8F28;z-index:5;display:flex;align-items:center;justify-content:center;transition:background .3s}.sheet-symbol{font-size:23px;color:#7152C1}.sheet-label{position:absolute;white-space:nowrap;bottom:61px;font-size:16px;color:#705A97;background:#F8F7FD;padding:4px 8px;border-radius:6px}.research-sheet i{display:none}.pipeline-node{animation:none!important;transition:background .3s,box-shadow .3s}.pipeline-node.running{background:#DBD2FF!important;box-shadow:0 0 0 9px #B4A2F32C!important}.pipeline-node.done{background:#EDE7FC!important;border-color:#9D89D8}

.product-display{position:absolute;left:660px;top:117px;width:708px;height:386px;overflow:hidden;border-radius:16px;box-shadow:0 24px 65px #30295720,0 0 0 1px #DBD8E7;transform:perspective(1400px) rotateY(-3deg);background:#FAFAFA}.product-display img{display:block;width:100%;height:100%;object-fit:contain}
.pipeline-track{position:absolute;left:140px;top:602px;width:1140px;height:3px;background:linear-gradient(90deg,#D6CEFA,#9E8FE8,#D6CEFA)}.pipeline-packet{position:absolute;left:140px;top:597px;width:44px;height:13px;border-radius:50%;background:#8D78ED;box-shadow:0 0 15px #8D78ED99;animation:travel 8s linear infinite;z-index:1}.pipeline-node{position:absolute;top:573px;width:62px;height:62px;border-radius:50%;background:#F8F7FF;border:1px solid #C8BFEB;z-index:2;animation:nodePulse 8s infinite}.pipeline-node svg{width:34px;height:34px;margin:13px}.step-1{animation-delay:2.4s}.step-2{animation-delay:4.8s}.step-3{animation-delay:7.2s}@keyframes travel{0%{transform:translateX(-15px);opacity:0}4%{opacity:1}94%{opacity:1}100%{transform:translateX(1125px);opacity:0}}@keyframes nodePulse{0%,22%{background:#E7E0FF;box-shadow:0 0 0 8px #B4A2F327}25%,100%{background:#F8F7FF;box-shadow:0 0 0 0 #B4A2F300}}.slide:not(.active) .pipeline-node,.slide:not(.active) .pipeline-packet{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.pipeline-node,.pipeline-packet{animation:none!important}.pipeline-packet{left:710px}}

:root{--ink:#24223E;--purple:#6554ED;--muted:#747187;--white:#F5F3FF;--lavender:#B9ADFF;--dark:#171627}
*{box-sizing:border-box}html,body{margin:0;min-height:100%;font-family:"Hiragino Sans GB","PingFang SC","Microsoft YaHei",sans-serif}body{background:#DFDFE9;color:var(--ink);overflow:hidden}button{font:inherit;cursor:pointer}button:focus-visible{outline:3px solid #9788FF;outline-offset:4px}
.viewport{height:calc(100dvh - 72px);display:flex;align-items:center;justify-content:center;padding:18px 22px 8px}.stage{position:relative;width:1440px;height:810px;flex:none;transform-origin:center;box-shadow:0 16px 55px #26203c22;overflow:hidden}.slide{position:absolute;inset:0;background:#F8F8FD;display:none;overflow:hidden}.slide.active{display:block}.slide.dark{background:var(--dark);color:var(--white)}
.slide:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 90% 0%,#E4DFFA75,transparent 60%);pointer-events:none}.slide.dark:before{background:radial-gradient(ellipse at 95% 10%,#4D3B7850,transparent 65%)}
.brand{position:absolute;left:56px;top:22px;width:300px;height:60px;z-index:4}.brand svg{display:block;width:300px;height:60px}.dark .brand{background:#FAFAFA;border-radius:13px}.e{position:absolute;line-height:1.35;letter-spacing:-.025em;white-space:pre-wrap;font-weight:400;z-index:3}.strong,.title{font-weight:600}.hero-title{font-weight:700;letter-spacing:-.065em}.muted{color:var(--muted)}.dark .muted{color:#AAA6C1}.purple{color:var(--purple)}.lavender{color:var(--lavender)}.white{color:#FCFBFF}.amber{color:#9C6330}.center{text-align:center}.right{text-align:right}.art{position:absolute;z-index:1}.art svg{width:100%;height:100%;overflow:visible}
.footer{position:absolute;left:74px;right:72px;bottom:25px;display:flex;justify-content:space-between;color:#A9A5B9;font-size:16px;letter-spacing:.02em;z-index:4}.footer:before{content:"";position:absolute;left:0;right:0;top:-15px;height:1px;background:#E0DDEC}.dark .footer{color:#7E789B}.dark .footer:before{background:#40394F}
.hero-halo{position:absolute;right:-130px;top:20px;width:980px;height:900px;background:radial-gradient(ellipse,#7262D13B,transparent 65%)}.manifold{position:absolute;pointer-events:none}.hero-manifold{right:-180px;top:60px;width:1000px;height:720px;opacity:.9}.hero-bottom{position:absolute;left:88px;top:646px;width:800px;height:85px}.accent-note{position:absolute;background:#EEEAFE;border-left:3px solid #8F80EE;height:68px}.compare-bg{position:absolute;left:902px;top:246px;width:466px;height:447px;border-radius:22px;background:linear-gradient(135deg,#7161EE,#5442CD);box-shadow:0 22px 35px #6554ed18}.compare-bg:after{content:"";position:absolute;left:-811px;top:86px;width:1260px;height:1px;background:linear-gradient(90deg,#DCD8EB 65%,#ffffff2a 65%);box-shadow:0 64px #c4bceb40,0 128px #c4bceb40,0 192px #c4bceb40,0 256px #c4bceb40,0 320px #c4bceb40}
.tools-half{position:absolute;top:257px;height:480px;width:618px;border-radius:28px}.tools-half.left{left:72px;background:#EFEDF8}.tools-half.right{left:750px;background:#ECEAF7}.task-field{position:absolute;left:74px;top:258px;width:665px;height:455px;background:linear-gradient(120deg,#ECE8FC,#F0EFF8);border-radius:26px}.task-field:after{content:"";position:absolute;left:37px;right:37px;top:109px;height:1px;background:#D6D0E6;box-shadow:0 108px #D6D0E6,0 216px #D6D0E6}.closing-halo{position:absolute;inset:0;background:radial-gradient(ellipse at 82% 50%,#6E5A9140,transparent 58%)}.closing-manifold{right:-320px;top:50px;width:1050px;height:800px;opacity:.36}
.toolbar{position:fixed;bottom:0;left:0;right:0;height:72px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;background:#EEEEF5;border-top:1px solid #D6D3E5;color:#635F78;gap:16px}.toolbar button{border:0;background:transparent;min-width:44px;height:44px;border-radius:12px;color:#5E586F}.toolbar button:hover{background:#DED9F2}.toolgroup{display:flex;gap:10px;align-items:center}.toolbar .icon{width:22px;height:22px;display:block;margin:auto}.counter{font-variant-numeric:tabular-nums;width:72px;text-align:center;font-size:15px}.dots{display:flex;gap:9px;align-items:center}.dots button{min-width:16px;width:16px;height:44px;padding:0}.dots button:after{content:"";display:block;width:6px;height:6px;border-radius:50%;background:#C1BACF;margin:auto}.dots button[aria-current=true]:after{background:#6A58DF;width:21px;border-radius:5px;height:6px}.current-name{min-width:170px;font-size:14px}.overview{position:fixed;inset:0;background:#EAE8F2F5;backdrop-filter:blur(20px);z-index:50;padding:60px 6vw;overflow:auto;display:none}.overview.open{display:block}.overview h2{font-size:26px;margin:0 0 30px}.overview-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.overview button{padding:24px;background:white;border:1px solid #DBD5EB;text-align:left;border-radius:16px;color:var(--ink);min-height:120px}.overview button:hover{border-color:#7963E8;transform:translateY(-2px)}.overview button span{display:block;color:#948BA6;font-size:13px;margin-bottom:16px}.overview button b{font-size:20px}.close-overview{position:absolute;right:6vw;top:22px;border:0;background:none;font-size:28px!important;min-height:44px!important;padding:5px 15px!important}.hide-text .brand svg,.hide-text .e,.hide-text .footer span{visibility:hidden!important}
@media(max-width:750px){.viewport{padding:0;height:calc(100dvh - 70px)}.stage{box-shadow:none}.toolbar{padding:0 9px;height:70px;gap:4px}.current-name,.dots{display:none}.overview-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.overview{padding:65px 20px}.toolbar .toolgroup{gap:2px}}
@media(prefers-reduced-motion:no-preference){.slide.active .art,.slide.active .manifold{animation:appear .55s ease-out}.slide.active .title{animation:rise .4s ease-out}.hero-manifold svg{animation:float 10s ease-in-out infinite alternate}@keyframes float{from{transform:translateY(-7px) rotate(-1deg)}to{transform:translateY(7px) rotate(1deg)}}@keyframes appear{from{opacity:.4;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}@keyframes rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@media print{@page{size:1440px 810px;margin:0}body{background:white;overflow:visible}.viewport{height:auto;display:block;padding:0}.stage{height:auto!important;transform:none!important;box-shadow:none;width:1440px!important;overflow:visible}.slide{display:block!important;position:relative;width:1440px;height:810px;break-after:page;print-color-adjust:exact;-webkit-print-color-adjust:exact}.toolbar,.overview{display:none!important}}
`;
const arrow=(dir)=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="${dir==='left'?'m14 6-6 6 6 6':'m10 6 6 6-6 6'}"/></svg>`;
let html=`<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>矩阵工坊 · 构建科学发现的流水线</title><meta name="description" content="矩阵工坊，构建科学发现的流水线。面向数学研究的 AI 科研平台，目前仅支持机构申请使用。"><style>${css}${densityCss}</style></head><body><main class="viewport"><div class="stage" id="stage">`;
pages.forEach((p,i)=>html+=`<section class="slide ${p.theme} ${i===0?'active':''}" id="slide-${i+1}" data-page-kind="${p.name}" aria-label="${p.name}" aria-hidden="${i!==0}">${brand()}${p.body}<div class="footer"><span>${p.name}</span><span>${String(i+1).padStart(2,'0')} / ${pages.length}</span></div></section>`);
html+=`</div></main><nav class="toolbar" aria-label="演示控制"><div class="toolgroup"><button id="overviewBtn" aria-label="查看目录"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg></button><span class="current-name" id="currentName">产品愿景</span></div><div class="dots">${pages.map((p,i)=>`<button data-page="${i}" aria-label="第 ${i+1} 页：${p.name}" aria-current="${i===0}"></button>`).join('')}</div><div class="toolgroup"><button id="prev" aria-label="上一页">${arrow('left')}</button><span class="counter" id="counter">01 / ${pages.length}</span><button id="next" aria-label="下一页">${arrow('right')}</button><button id="fullscreen" aria-label="全屏演示"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg></button></div></nav><aside class="overview" id="overview" aria-label="演示目录"><h2>演示目录</h2><button class="close-overview" aria-label="关闭目录">×</button><div class="overview-grid">${pages.map((p,i)=>`<button data-page="${i}"><span>${String(i+1).padStart(2,'0')}</span><b>${p.name}</b></button>`).join('')}</div></aside>`;
const js=`
const slides=[...document.querySelectorAll('.slide')];let current=0;const names=${JSON.stringify(pages.map(p=>p.name))};
function resize(){let scale=Math.min((innerWidth-(innerWidth<750?0:44))/1440,(innerHeight-94)/810);document.getElementById('stage').style.transform='scale('+scale+')'}
window.addEventListener('resize',resize);resize();
function go(i){current=Math.max(0,Math.min(slides.length-1,i));slides.forEach((s,j)=>{s.classList.toggle('active',j===current);s.setAttribute('aria-hidden',j!==current)});document.querySelectorAll('.dots button').forEach((b,j)=>b.setAttribute('aria-current',j===current));document.getElementById('counter').textContent=String(current+1).padStart(2,'0')+' / '+slides.length;document.getElementById('currentName').textContent=names[current];document.getElementById('prev').disabled=current===0;document.getElementById('next').disabled=current===slides.length-1;history.replaceState(null,'','#'+(current+1));document.getElementById('overview').classList.remove('open')};window.go=go;
document.getElementById('prev').onclick=()=>go(current-1);document.getElementById('next').onclick=()=>go(current+1);document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>go(Number(b.dataset.page)));
document.getElementById('overviewBtn').onclick=()=>document.getElementById('overview').classList.toggle('open');document.querySelector('.close-overview').onclick=()=>document.getElementById('overview').classList.remove('open');document.getElementById('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{}};
document.addEventListener('keydown',ev=>{if(ev.altKey||ev.metaKey||ev.ctrlKey||document.querySelector('.image-dialog[open]'))return;if(['ArrowRight','PageDown',' '].includes(ev.key)){ev.preventDefault();go(current+1)}if(['ArrowLeft','PageUp'].includes(ev.key)){ev.preventDefault();go(current-1)}if(ev.key==='Home')go(0);if(ev.key==='End')go(slides.length-1);if(ev.key==='Escape')document.getElementById('overview').classList.remove('open')});
let tx=0,ty=0;document.querySelector('.viewport').addEventListener('touchstart',e=>{tx=e.changedTouches[0].clientX;ty=e.changedTouches[0].clientY},{passive:true});document.querySelector('.viewport').addEventListener('touchend',e=>{let dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)go(current+(dx<0?1:-1))},{passive:true});
function manifold(el){let w=1000,h=760,out='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 760"><defs><linearGradient id="mesh'+el.dataset.kind+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#DFD7FF"/><stop offset=".46" stop-color="#A18CFA"/><stop offset="1" stop-color="#50448B"/></linearGradient></defs>';function point(u,v){let x=(2.2+v*Math.cos(u/2))*Math.cos(u),y=(2.2+v*Math.cos(u/2))*Math.sin(u),z=v*Math.sin(u/2);let a=.65,xx=x*Math.cos(a)-y*Math.sin(a),yy=x*Math.sin(a)+y*Math.cos(a);return [500+xx*107,360+z*156+yy*49]};for(let j=0;j<=28;j++){let v=-.82+1.64*j/28,d='';for(let i=0;i<=180;i++){let q=point(i/180*Math.PI*2,v);d+=(i?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1)}out+='<path d="'+d+'" fill="none" stroke="url(#mesh'+el.dataset.kind+')" stroke-width="'+(j%7===0?1.5:.7)+'" opacity=".65"/>'}for(let i=0;i<95;i++){let d='';for(let j=0;j<=30;j++){let q=point(i/95*Math.PI*2,-.82+j/30*1.64);d+=(j?'L':'M')+q[0].toFixed(1)+','+q[1].toFixed(1)}out+='<path d="'+d+'" fill="none" stroke="#BDA7FF" stroke-width=".65" opacity=".45"/>'}out+='</svg>';el.innerHTML=out};document.querySelectorAll('.manifold').forEach(manifold);go(Number(location.hash.slice(1)||1)-1);
`;
const enhancement=`
const imageDialog=document.createElement('dialog');imageDialog.className='image-dialog';imageDialog.innerHTML='<button class="close-image" aria-label="关闭原图">×</button><button class="fit-image">适应窗口</button><img alt="矩阵工坊产品原图">';document.body.append(imageDialog);imageDialog.querySelector('img').src=document.querySelector('.product-display img').src;
document.querySelector('.product-display').onclick=()=>imageDialog.showModal();imageDialog.querySelector('.close-image').onclick=()=>imageDialog.close();imageDialog.querySelector('.fit-image').onclick=e=>{imageDialog.classList.toggle('fit');e.target.textContent=imageDialog.classList.contains('fit')?'原始尺寸':'适应窗口'};imageDialog.onclick=e=>{if(e.target===imageDialog&&e.offsetX<0)imageDialog.close()};
function openEvidence(src,alt){imageDialog.classList.remove('fit');imageDialog.querySelector('.fit-image').textContent='适应窗口';const img=imageDialog.querySelector('img');img.src=src;img.alt=alt;imageDialog.scrollTop=0;imageDialog.scrollLeft=0;imageDialog.showModal()};
document.querySelector('.product-display').onclick=()=>openEvidence(document.querySelector('.product-display img').src,'矩阵工坊产品展示原图');
document.querySelectorAll('[data-evidence-gallery]').forEach(g=>{const views=[...g.querySelectorAll('.evidence-view')],options=[...g.querySelectorAll('.evidence-option')];const set=(view,o)=>{const img=view.querySelector('img');img.src=o.dataset.source;img.alt=o.dataset.alt;img.style.objectPosition=o.dataset.position;view.querySelector('.evidence-label').textContent=o.dataset.alt;view.setAttribute('aria-label','放大查看'+img.alt)};options.forEach((o,i)=>o.onclick=()=>{options.forEach(x=>{x.classList.toggle('selected',x===o);x.setAttribute('aria-selected',x===o)});g.classList.toggle('dual',!!options[i+1]);views.forEach((v,j)=>{v.hidden=!options[i+j];if(options[i+j])set(v,options[i+j])})});views.forEach(v=>v.onclick=()=>{const img=v.querySelector('img');openEvidence(img.src,img.alt)})});
const scene=document.querySelector('.factory-scene'),pause=document.querySelector('.animation-toggle');pause.onclick=()=>{const stopped=scene.classList.toggle('paused');pause.textContent=stopped?'继续动画':'暂停动画';pause.setAttribute('aria-label',stopped?'继续流程动画':'暂停流程动画')};

`;
const scienceAnimation=await fs.readFile(ROOT+'scripts/animate.js','utf8');
html+=`<script>${js}\n${enhancement}\n${scienceAnimation}</script></body></html>`;
await fs.writeFile(OUT+'index.html',html);
console.log('Created',pages.length,'slides');
