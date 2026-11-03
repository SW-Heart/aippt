// 矩阵工坊演示文稿构建脚本
// 读取 src/ 中的样式与交互脚本、assets/ 中的截图，生成单文件 index.html（所有图片内嵌，可离线打开）。
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const read = (p, enc) => fs.readFile(ROOT + p, enc);

// ---------- 资源 ----------
const mime = { png: 'image/png', webp: 'image/webp', jpg: 'image/jpeg' };
const cache = {};
async function asset(p) {
  if (!cache[p]) cache[p] = `data:${mime[p.split('.').pop()]};base64,${(await read('assets/' + p)).toString('base64')}`;
  return cache[p];
}
const shot = (name) => asset(`screenshots/${name}.png`);

// ---------- 图标（24×24 线性） ----------
const ICONS = {
  cloud: 'M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.1 9.5 4.25 4.25 0 0 0 7 18Z',
  clock: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  search: 'm20 20-4.2-4.2M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z',
  check: 'M9 12.5 11 14.5 15.5 10M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  tree: 'M6 4h4v4H6zM14 10h4v4h-4zM14 17h4v4h-4zM8 8v11h6M8 12h6',
  people: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.2c2.1.7 3.5 2.8 3.5 5.8',
  file: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5ZM14 3v5h5M9 13h6M9 17h4',
  flask: 'M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7.5 15h9',
  lock: 'M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11',
  code: 'm8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14',
  book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5',
  shield: 'M12 3 4.5 6v6c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3ZM9 12l2 2 4-4',
  chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8Z',
  pin: 'M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  star: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z',
};
const ico = (k) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[k]}"/></svg>`;

// ---------- 组件 ----------
const SECTIONS = ['', '问题与方案', '工位 01 · 提出问题', '工位 02 · 自主探索', '工位 03 · 人机协作', '工位 04 · 验证交付'];
const rv = (i) => `rv d${i}`;
const STAGES = ['提出问题', '自主探索', '人机协作', '验证交付'];
const kick = (n) => `<p class="kicker stagek ${rv(0)}"><span class="seg">${STAGES.map((_, i) => `<i class="${i + 1 < n ? 'past' : i + 1 === n ? 'on' : ''}"></i>`).join('')}</span>流水线 · 工位 0${n}<b>${STAGES[n - 1]}</b></p>`;

async function gallery(items, { tabs = true, height } = {}) {
  const imgs = await Promise.all(items.map(async ([name, label, opts = {}], i) =>
    `<img class="${i === 0 ? 'on' : ''} ${opts.contain ? 'contain' : ''}" src="${await shot(name)}" alt="${label}" data-file="${opts.file || label}" style="object-position:${opts.pos || 'top center'}" loading="lazy">`));
  const tabBar = tabs && items.length > 1
    ? `<div class="tabs" role="tablist">${items.map(([, label], i) => `<button role="tab" aria-selected="${i === 0}">${label}</button>`).join('')}</div>`
    : '';
  const first = items[0][2]?.file || items[0][1];
  return `<div class="gallery" style="${height ? `height:${height}px` : ''}">${tabBar}
    <div class="win" data-zoom><div class="win-bar"><i></i><i></i><i></i><span class="wt">${first}</span><span class="zoom">⤢ 点击放大</span></div>
    <div class="shots">${imgs.join('')}</div></div></div>`;
}

// ---------- 页面 ----------
const slides = [];
const add = (name, sec, body, { dark = false, desc = '' } = {}) => slides.push({ name, sec, body, dark, desc });

// 01 封面：自动化科研流水线（研究件沿传送带经过 4 个工位，逐步变形；JS 驱动见 src/deck.js）
const STATIONS = [
  ['提出问题', '目标 · 约束 · 验证方式', 'INPUT'],
  ['自主探索', '多 Agent 并行 · 数十天运行', 'EXPLORE'],
  ['人机协作', '关键节点 @ 研究者审核', 'REVIEW'],
  ['验证交付', 'Lean4 定理库 · 机器检查证明', 'VERIFY'],
];
const MX = [170, 490, 810, 1130];
function stationScreen(i, x) {
  const L = x - 64, T = 80;
  if (i === 0) return [0, 1, 2].map((k) => `<rect class="pl-type" style="--k:${k}" x="${L}" y="${T + k * 14}" width="${[80, 96, 56][k]}" height="6" rx="3"/>`).join('')
    + `<text class="pl-big" x="${x + 46}" y="${T + 30}" text-anchor="middle">?</text>`;
  if (i === 1) {
    const ends = [[x - 8, T - 2], [x - 8, T + 16], [x - 8, T + 34], [x + 44, T - 6], [x + 44, T + 10], [x + 44, T + 30], [x + 44, T + 42]];
    const par = [[L, T + 16], [L, T + 16], [L, T + 16], ends[0], ends[0], ends[1], ends[2]];
    return ends.map(([ex, ey], k) => `<path class="pl-br" d="M${par[k][0]} ${par[k][1]}C${par[k][0] + 30} ${par[k][1]} ${ex - 30} ${ey} ${ex} ${ey}"/>`).join('')
      + `<circle class="pl-nd root" cx="${L}" cy="${T + 16}" r="4"/>` + ends.map(([ex, ey], k) => `<circle class="pl-nd ${k === 4 ? 'ok' : ''}" style="--k:${k}" cx="${ex}" cy="${ey}" r="3.5"/>`).join('');
  }
  if (i === 2) return [0, 1, 2].map((k) => `<rect class="pl-box" x="${L}" y="${T - 4 + k * 15}" width="9" height="9" rx="2"/><path class="pl-tick" style="--k:${k}" d="M${L + 2} ${T + 1 + k * 15}l2 2 4-4"/><rect class="pl-ln" x="${L + 16}" y="${T - 1 + k * 15}" width="${[70, 54, 76][k]}" height="4" rx="2"/>`).join('')
    + `<circle class="pl-at" cx="${x + 46}" cy="${T + 14}" r="17"/><text class="pl-atx" x="${x + 46}" y="${T + 20}" text-anchor="middle">@</text>`;
  return `<text class="pl-mono" x="${L}" y="${T + 4}">lake build</text><text class="pl-mono ok" x="${x + 64}" y="${T + 4}" text-anchor="end">61/61</text>
    <rect class="pl-bar-bg" x="${L}" y="${T + 14}" width="128" height="6" rx="3"/><rect class="pl-bar" x="${L}" y="${T + 14}" width="128" height="6" rx="3"/>
    <text class="pl-mono" x="${L}" y="${T + 38}">sha256 ✓  pdf ✓</text>`;
}
const pipelineSvg = `<svg class="pipe" viewBox="0 0 1296 262" aria-label="自动化科研流水线动画">
  <text class="pl-head" x="0" y="12">AUTOMATED RESEARCH PIPELINE</text><circle class="pl-live" cx="250" cy="8" r="4"/><text class="pl-head dim" x="262" y="12">运行中</text>
  <text class="pl-head dim" x="1248" y="12" text-anchor="end">已交付成果</text><text class="pl-count" x="1296" y="13" text-anchor="end">000</text>
  <g class="pl-belt"><rect x="0" y="176" width="1296" height="12" rx="6"/><path class="pl-dash" d="M8 182H1288"/>
    ${Array.from({ length: 27 }, (_, k) => `<circle class="pl-roll" cx="${12 + k * 49.3}" cy="196" r="4"/>`).join('')}</g>
  <g class="pl-tokens"></g>
  ${MX.map((x, i) => `<g class="pl-st" data-x="${x}">
    <rect class="pl-body" x="${x - 88}" y="36" width="176" height="140" rx="14"/>
    <rect class="pl-tunnel" x="${x - 40}" y="142" width="80" height="34" rx="6"/>
    <rect class="pl-scan" x="${x - 40}" y="142" width="80" height="3" rx="1.5"/>
    <rect class="pl-screen" x="${x - 76}" y="50" width="152" height="84" rx="8"/>
    <text class="pl-tag" x="${x - 66}" y="66">0${i + 1} · ${STATIONS[i][2]}</text><circle class="pl-led" cx="${x + 64}" cy="62" r="3.5"/>
    <g class="pl-vis v${i}">${stationScreen(i, x)}</g>
    <text class="pl-name" x="${x}" y="226" text-anchor="middle">${STATIONS[i][0]}</text>
    <text class="pl-sub" x="${x}" y="250" text-anchor="middle">${STATIONS[i][1]}</text>
  </g>`).join('')}
</svg>`;

// 01 封面 ---------------------------------------------------------------
add('封面', 0, `
<div class="content cover">
  <div style="position:absolute;left:0;top:10px;width:560px">
    <p class="kicker ${rv(0)}">AI Research Agent · 面向数学研究</p>
    <h1 class="title ${rv(1)}">矩阵工坊</h1>
    <p class="sub ${rv(2)}">构建科学发现的流水线</p>
    <p class="lead ${rv(3)}">让 AI 持续检索、探索、计算与验证，<br>让研究者专注于提出问题、判断方向。</p>
  </div>
  <button class="shot ${rv(2)}" data-zoom aria-label="放大查看产品主页"><img src="${await asset('product.png')}" alt="矩阵工坊产品主页"></button>
  ${pipelineSvg}
</div>`, { dark: true, desc: '构建科学发现的流水线' });

// 02 问题 ---------------------------------------------------------------
add('AI 科研的最后一公里', 1, `
<div class="content">
  <div class="head">
    <p class="kicker ${rv(0)}">问题</p>
    <h2 class="${rv(1)}">通用 AI 已经很强，<span class="hl">但科研不止一次对话</span></h2>
    <p class="lead ${rv(2)}">直接使用 Codex、Claude 等通用 Agent，模型能力已经足够；但让它真正产出科研成果，配套环节仍需研究者自己搭建。</p>
  </div>
  <div class="gap-track ${rv(3)}">
    <div class="have"><span>通用模型能力：推理、编码、写作</span><small>已具备</small></div>
    <div class="miss"><span>最后一公里</span><small>→ 可交付的科研成果</small></div>
  </div>
  <div class="grid gaps">
    ${[
      ['cloud', '环境与算力', '软件环境、GPU 与数据隔离，需要自行准备和维护'],
      ['clock', '长周期探索', '任务拆解、持续调度与中途干预，需要额外组织'],
      ['search', '专业工具', '学术检索、计算仿真等工具，需要逐项接入'],
      ['check', '证明验证', '生成的推导需严格检查，Lean4 依赖与流程需另行准备'],
      ['tree', '进度追踪', '探索分支与关键节点需持续跟踪，受阻时难以及时发现'],
      ['people', '团队协作', '多人分工、资料共享与成果汇总，缺少统一工作空间'],
    ].map(([k, t, d], i) => `<div class="card ${rv(4 + i)}">${ico(k)}<div><h3>${t}</h3><p>${d}</p></div></div>`).join('')}
  </div>
  <p class="note" style="position:absolute;left:0;bottom:-6px">讨论口径：通用 Agent 配合自行组织的科研流程；具体能力取决于版本、部署与工具配置。</p>
</div>`);

// 03 我们做什么 -----------------------------------------------------------
const arrow = (dir) => `<svg viewBox="0 0 120 14" fill="none" stroke="currentColor" stroke-width="1.5">${dir === 'r' ? '<path d="M2 7h114M108 1l8 6-8 6"/>' : '<path d="M118 7H4M12 1 4 7l8 6"/>'}</svg>`;
add('我们做什么', 1, `
<div class="content">
  <div class="head">
    <p class="kicker ${rv(0)}">我们的回答</p>
    <h2 class="${rv(1)}">研究者掌握方向，<span class="hl">AI 承担持续执行</span></h2>
  </div>
  <div class="roles">
    <div class="human ${rv(2)}">
      <div class="who">Researcher</div>
      <h3 class="big">科研工作者</h3>
      <div class="points">
        <div class="point"><h3>定义问题</h3><p>明确目标、假设与约束</p></div>
        <div class="point"><h3>引导探索</h3><p>在关键节点补充指导与判断</p></div>
        <div class="point"><h3>审阅成果</h3><p>评估结论与证明质量</p></div>
      </div>
      <p class="note" style="margin-top:30px;padding-top:18px;border-top:1px solid var(--line)">投入少量关键判断，换取持续数十天的研究推进。</p>
    </div>
    <div class="link ${rv(3)}">
      <div>课题与指导${arrow('r')}</div>
      <div>${arrow('l')}进展与成果</div>
    </div>
    <div class="ai ${rv(4)}">
      <div class="who">MatFoundry Agent</div>
      <h3 class="big">矩阵工坊 AI</h3>
      <div class="steps4">
        ${[['检索与拆解', '梳理相关工作，拆出研究分支'], ['探索与计算', '证明尝试与计算实验并行推进'], ['论证与验证', '推导核查与 Lean4 形式化验证'], ['成果整理', '输出论文、证明与复现材料']]
          .map(([t, d], i) => `<div><span class="num">0${i + 1}</span><b>${t}</b><span>${d}</span></div>`).join('')}
      </div>
    </div>
  </div>
</div>`);

// 04 流水线总览 -----------------------------------------------------------
const lanes = [
  ['提出问题', '从一个边界清晰的课题开始', [['定义研究问题', 5]]],
  ['自主探索', '在开箱即用的环境里，长时间、多路径推进', [['科研环境', 6], ['长周期探索', 7], ['专业工具', 8]]],
  ['人机协作', '过程透明，关键节点由研究者把关', [['协作看板', 9], ['进度与审核', 10]]],
  ['验证交付', '复用定理库，机器检查证明，成果可复现', [['定理库与知识图谱', 11], ['Lean4 验证', 12], ['论文与复现', 13], ['任务总结', 14]]],
];
add('一条流水线', 1, `
<div class="content">
  <div class="head">
    <p class="kicker ${rv(0)}">产品全景</p>
    <h2 class="${rv(1)}">把科研变成一条<span class="hl">自动化流水线</span></h2>
    <p class="lead ${rv(1)}">四个工位首尾相接：研究问题从一端投入，可验证的成果从另一端产出。</p>
  </div>
  <div class="lanes">
    ${lanes.map(([t, d, items], i) => `<div class="lane ${rv(2 + i)}"><div class="dot">0${i + 1}</div><h3>${t}</h3><p>${d}</p>
      <ul>${items.map(([n, p]) => `<li><button data-go="${p - 1}" style="all:unset;cursor:pointer;display:flex;justify-content:space-between;align-items:center;width:100%">${n}<span>P${String(p).padStart(2, '0')} →</span></button></li>`).join('')}</ul></div>`).join('')}
  </div>
  <div class="principles ${rv(6)}">
    <span class="num">贯穿全程</span>
    ${[['lock', '数据隔离', '每个课题独立环境'], ['tree', '过程留痕', '每一步探索都可回溯'], ['people', '人工把关', '关键结论由研究者判断']].map(([k, t, d]) => `<div>${ico(k)}<b>${t}</b><span>${d}</span></div>`).join('')}
  </div>
</div>`);

// 05 定义研究问题 ----------------------------------------------------------
const dispatchSvg = `<svg viewBox="0 0 680 176" aria-label="课题投入流水线并拆解为研究分支">
  <g class="node root" style="--d:1.5s"><rect x="0" y="66" width="104" height="44" rx="10"/><text x="52" y="93" text-anchor="middle">OPE-88</text></g>
  <path class="edge" style="--len:400;--d:1.8s" d="M104 88H196"/>
  <g class="node" style="--d:2s"><rect class="hub" x="196" y="66" width="112" height="44" rx="10"/><text class="hubt" x="252" y="93" text-anchor="middle">监督者</text></g>
  ${['分支 A · 证明路径探索', '分支 B · 计算实验与反例', '分支 C · Lean4 形式化', '分支 D · 论文材料整理'].map((t, k) => {
    const y = 4 + k * 46;
    return `<path class="edge" style="--len:400;--d:${2.3 + k * .15}s" d="M308 88C360 88 368 ${y + 17} 420 ${y + 17}"/>
    <g class="node" style="--d:${2.6 + k * .15}s"><rect class="chipr" x="420" y="${y}" width="260" height="34" rx="8"/><circle class="chipd" cx="438" cy="${y + 17}" r="4"/><text x="452" y="${y + 22}">${t}</text></g>
    <g class="node" style="--d:3.4s"><circle class="flowdot" r="3.5"><animateMotion dur="${1.6 + k * .2}s" repeatCount="indefinite" path="M308 88C360 88 368 ${y + 17} 420 ${y + 17}"/></circle></g>`;
  }).join('')}
</svg>`;
add('定义研究问题', 2, `
<div class="content">
  <div class="row" style="gap:48px;height:100%;align-items:stretch">
    <div style="flex:0 0 590px;display:flex;flex-direction:column">
      ${kick(1)}
      <h2 class="${rv(1)}">从一个<span class="hl">边界清晰</span>的<br>研究问题开始</h2>
      <p class="lead ${rv(2)}">写清目标、已有材料、约束与验证方式——这是投入流水线的“原料规格”，决定了 Agent 能否长时间自主推进而不跑偏。</p>
      <p class="num ${rv(3)}" style="margin:auto 0 14px">适合投入流水线的研究任务</p>
      <div class="tasks2">
        ${[['search', '猜想与证明路径探索', '尝试候选思路，推进研究论证'], ['flask', '计算实验与反例搜索', '检验特殊情形与候选结论'], ['check', '已有推导的形式化验证', '整理为机器可检查的 Lean4 文件'], ['file', '论文与证明材料整理', '归纳研究过程与阶段结果']]
          .map(([k, t, d], i) => `<div class="t ${rv(4 + i)}">${ico(k)}<b>${t}</b><span>${d}</span></div>`).join('')}
      </div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;gap:16px;min-width:0">
      <div class="ticket ${rv(2)}">
        <div class="tb"><span class="tag lime">课题</span><b>Wilson 定理：完整证明与形式化</b><span style="margin-left:auto">OPE-88</span></div>
        <dl>
          ${[['研究问题', '对任意整数 n &gt; 1，<span class="math">n 为素数 ⇔ (n − 1)! ≡ −1 (mod n)</span>'], ['已有材料', '原始证明、论文草稿与计算代码'], ['约束条件', '两个方向独立证明，不调用 Mathlib 现成的 Wilson 定理'], ['验证方式', 'Python / SageMath 计算核对 + Lean4 形式化检查'], ['预期交付', '论文 PDF、Lean 工程、可复现代码包'], ['负责人', '研究者 · 关键节点 @ 审核']]
            .map(([k, v], i) => `<div class="tf" style="--k:${i}"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}
        </dl>
      </div>
      <div class="dispatch ${rv(3)}">
        <div class="dh"><span class="mono">投入流水线 → 自动拆解为研究分支</span><span class="note">示例：Wilson 定理为经典结果，用于完整展示流程</span></div>
        <div class="tree">${dispatchSvg}</div>
      </div>
    </div>
  </div>
</div>`);


// 06 科研环境 -------------------------------------------------------------
const mv = (path, dur, begin = 0, cls = 'flowdot') => `<circle class="${cls}" r="3"><animateMotion dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${path}"/></circle>`;
const tools = [['py', 'Python'], ['sage', 'SageMath'], ['∀', 'Lean4'], ['TeX', 'LaTeX'], ['⌕', '学术检索']];
const sandboxSvg = `<svg class="sbx" viewBox="0 0 700 600" aria-label="课题沙盒架构">
  <rect class="sbx-frame" x="1" y="1" width="698" height="598" rx="18"/>
  <path class="sbx-rule" d="M1 48H699"/>
  <circle cx="24" cy="24" r="5" class="sbx-dot"/><circle cx="40" cy="24" r="5" class="sbx-dot"/><circle cx="56" cy="24" r="5" class="sbx-dot"/>
  <text class="sbx-mono" x="76" y="29">sandbox://ope-88 · isolated</text>
  <rect class="sbx-pill" x="586" y="13" width="96" height="22" rx="11"/><circle class="sbx-live" cx="600" cy="24" r="3.5"/><text class="sbx-pillt" x="644" y="28" text-anchor="middle">RUNNING</text>

  <!-- L1 models -->
  <text class="sbx-lab" x="24" y="78">MODELS · 模型路由</text>
  <rect class="sbx-chip dk" x="24" y="90" width="110" height="40" rx="9"/><text class="sbx-chipt w" x="79" y="115" text-anchor="middle">GPT</text>
  <rect class="sbx-chip dk" x="144" y="90" width="110" height="40" rx="9"/><text class="sbx-chipt w" x="199" y="115" text-anchor="middle">Claude</text>
  <rect class="sbx-chip dash" x="264" y="90" width="120" height="40" rx="9"/><text class="sbx-chipt" x="324" y="115" text-anchor="middle">更多模型…</text>
  <text class="sbx-note" x="516" y="115" text-anchor="end">按任务自由切换</text>
  <path class="sbx-wire" d="M199 130V178M79 130V150H199M324 130V150H199"/>
  ${mv('M199 130V178', 1.4)}${mv('M79 130V150H199V178', 2)}

  <!-- L2 agents -->
  <text class="sbx-lab" x="24" y="174">AGENTS · 编排层</text>
  <rect class="sbx-box" x="24" y="182" width="504" height="112" rx="12"/>
  <path class="sbx-wire" d="M214 238H132M214 238C180 238 170 262 132 262M334 238H416M334 238C368 238 378 262 416 262M214 238C180 238 170 214 132 214M334 238C368 238 378 214 416 214"/>
  ${mv('M214 238C180 238 170 214 132 214', 1.6)}${mv('M132 262C170 262 180 238 214 238', 1.9, .4)}${mv('M334 238C368 238 378 214 416 214', 1.7, .2)}${mv('M416 262C378 262 368 238 334 238', 2.1, .7)}
  <rect class="sbx-hub" x="214" y="218" width="120" height="40" rx="10"/><text class="sbx-hubt" x="274" y="243" text-anchor="middle">监督者</text>
  ${[['探索 Agent A', 40, 199], ['探索 Agent B', 40, 247], ['探索 Agent C', 416, 199], ['审稿 Agent', 416, 247]].map(([t, x, y]) => `<rect class="sbx-ag" x="${x}" y="${y}" width="96" height="30" rx="8"/><text class="sbx-agt" x="${x + 48}" y="${y + 20}" text-anchor="middle">${t}</text>`).join('')}

  <!-- L3 tools -->
  <text class="sbx-lab" x="24" y="324">TOOLS · 工具链</text>
  ${tools.map(([g, n], k) => { const x = 24 + k * 103; return `${k ? `<path class="sbx-wire" d="M${x + 46} 294V334"/>${mv(`M${x + 46} 294V334`, 1.2 + k * .17, k * .3)}` : ''}
    <rect class="sbx-tile" x="${x}" y="334" width="92" height="74" rx="10"/><text class="sbx-glyph" x="${x + 46}" y="368" text-anchor="middle">${g}</text><text class="sbx-tn" x="${x + 46}" y="394" text-anchor="middle">${n}</text>`; }).join('')}

  <!-- L4 compute -->
  <text class="sbx-lab" x="24" y="438">COMPUTE · GPU</text>
  ${Array.from({ length: 8 }, (_, k) => { const x = 24 + k * 64.6; const vals = ['38;52;30', '20;48;44', '50;28;54', '30;54;40', '44;24;50', '26;46;34', '52;36;22', '34;20;48'][k]; const ys = vals.split(';').map((v) => 512 - v).join(';');
    return `<rect class="sbx-gpu" x="${x}" y="448" width="54" height="84" rx="7"/><rect class="sbx-meter" x="${x + 21}" y="458" width="12" height="54" rx="3"/>
    <rect class="sbx-fill" x="${x + 21}" y="474" width="12" height="38" rx="3"><animate attributeName="height" values="${vals};${vals.split(';')[0]}" dur="${2.4 + k * .3}s" repeatCount="indefinite"/><animate attributeName="y" values="${ys};${ys.split(';')[0]}" dur="${2.4 + k * .3}s" repeatCount="indefinite"/></rect>
    <text class="sbx-gt" x="${x + 27}" y="526" text-anchor="middle">GPU${k}</text>`; }).join('')}
  <text class="sbx-note" x="24" y="572">无需本地安装 · 打开即用 · 每个课题独立运行</text>

  <!-- data band -->
  <rect class="sbx-data" x="548" y="64" width="130" height="476" rx="12"/>
  <g transform="translate(597 92)" class="sbx-lock"><rect x="2" y="13" width="28" height="22" rx="4"/><path d="M8 13V9a8 8 0 0 1 16 0v4"/><circle cx="16" cy="24" r="2.5"/></g>
  <text class="sbx-dl" x="613" y="158" text-anchor="middle">DATA</text>
  <text class="sbx-dt" x="613" y="184" text-anchor="middle">课题数据</text><text class="sbx-dt" x="613" y="206" text-anchor="middle">隔离存储</text>
  ${[0, 1, 2, 3].map((k) => `<rect class="sbx-file" x="${578 + (k % 2) * 36}" y="${248 + Math.floor(k / 2) * 46}" width="28" height="36" rx="4"/><path class="sbx-fl" d="M${584 + (k % 2) * 36} ${262 + Math.floor(k / 2) * 46}h16M${584 + (k % 2) * 36} ${270 + Math.floor(k / 2) * 46}h12"/>`).join('')}
  <text class="sbx-dm" x="613" y="372" text-anchor="middle">proofs/</text><text class="sbx-dm" x="613" y="392" text-anchor="middle">papers/</text><text class="sbx-dm" x="613" y="412" text-anchor="middle">logs/</text>
  <text class="sbx-dt s" x="613" y="500" text-anchor="middle">不出沙盒</text><text class="sbx-dm" x="613" y="520" text-anchor="middle">per-project</text>
  ${[110, 238, 371, 490].map((y, k) => `<path class="sbx-wire dashw" d="M528 ${y}H548"/>${mv(`M528 ${y}H548`, 1, k * .25, 'flowdot lime')}`).join('')}
</svg>`;
add('科研环境', 3, `
<div class="content">
  <div class="row" style="gap:56px;height:100%">
    <div style="flex:0 0 470px">
      ${kick(2)}
      <h2 class="${rv(1)}">科研环境，<span class="hl">打开即用</span></h2>
      <p class="lead ${rv(2)}" style="margin-bottom:40px">流水线的“车间”已经搭好：软件、算力与模型就绪，研究者直接进入课题，不必先当运维。</p>
      <div class="points">
        <div class="point ${rv(3)}"><h3>独立云端沙盒</h3><p>无需本地预装，每个课题在独立环境中运行</p></div>
        <div class="point ${rv(4)}"><h3>高性能 GPU 计算</h3><p>为计算密集的研究任务提供算力</p></div>
        <div class="point ${rv(5)}"><h3>模型自由选择</h3><p>GPT、Claude 等模型按研究需要切换</p></div>
        <div class="point ${rv(6)}"><h3>研究数据隐私隔离</h3><p>课题数据仅在所属环境内流转</p></div>
      </div>
    </div>
    <div class="${rv(3)}" style="flex:1;min-width:0;margin-top:-6px">${sandboxSvg}</div>
  </div>
</div>`);


// 07 长周期探索 -----------------------------------------------------------
const edge = (x1, y1, x2, y2, d, cls = '') => `<path class="edge ${cls}" style="--len:400;--d:${d}s" d="M${x1} ${y1}C${x1 + 70} ${y1} ${x2 - 70} ${y2} ${x2} ${y2}"/>`;
const node = (x, y, d, cls = '', label = '', lx = 0, ly = -16) => `<g class="node ${cls}" style="--d:${d}s"><circle cx="${x}" cy="${y}" r="8"/>${label ? `<text x="${x + lx}" y="${y + ly}" text-anchor="middle">${label}</text>` : ''}</g>`;
const treeSvg = `<svg viewBox="0 0 660 500" aria-label="研究分支探索示意">
  ${edge(120, 250, 270, 70, .5)}${edge(120, 250, 270, 190, .6)}${edge(120, 250, 270, 310, .7)}${edge(120, 250, 270, 430, .8)}
  ${edge(270, 70, 420, 50, 1.2, 'dead')}
  ${edge(270, 190, 420, 160, 1.3)}${edge(270, 190, 420, 230, 1.35, 'dead')}${edge(420, 160, 570, 160, 1.9)}
  ${edge(270, 310, 420, 320, 1.45)}
  ${edge(270, 430, 420, 450, 1.55)}${edge(420, 450, 570, 450, 2.1, 'dead')}
  <g class="node root" style="--d:.2s"><rect x="0" y="228" width="120" height="44" rx="10"/><text x="60" y="255" text-anchor="middle">监督者</text></g>
  ${node(270, 70, .9, '', '路径 A')}${node(270, 190, 1, '', '路径 B')}${node(270, 310, 1.1, '', '路径 C')}${node(270, 430, 1.2, '', '路径 D')}
  ${node(420, 50, 1.5, 'x', '反例否定', 0, -16)}
  ${node(420, 160, 1.6, '', '')}${node(420, 230, 1.6, 'x', '受阻放弃', 0, 30)}
  ${node(570, 160, 2.2, 'ok', '')}
  ${node(420, 320, 1.7, 'ask', '')}
  ${node(420, 450, 1.8, '', '')}${node(570, 450, 2.3, '', '计算实验中…', 0, 30)}
  <g class="node" style="--d:2.4s"><circle class="pulse" cx="420" cy="320" r="8" fill="none" stroke="#E2A33B" stroke-width="2"/></g>
  <g class="node okflag" style="--d:2.4s"><rect x="500" y="100" width="140" height="34" rx="8"/><text x="570" y="122" text-anchor="middle">✓ 候选证明成立</text></g>
  <g class="node flag" style="--d:2.6s"><rect x="448" y="302" width="196" height="36" rx="8"/><text x="546" y="325" text-anchor="middle">@研究者 · 需要方向指导</text></g>
</svg>`;
add('长周期探索', 3, `
<div class="content">
  <div class="row" style="gap:48px;height:100%">
    <div style="flex:0 0 520px">
      ${kick(2)}
      <h2 class="${rv(1)}">长时间运行，<br><span class="hl">持续推进研究</span></h2>
      <div class="bignum ${rv(2)}" style="margin:30px 0 8px">几十<small>天</small></div>
      <p class="${rv(3)}" style="font-size:17px;color:var(--ink-2);margin:14px 0 30px">单个课题可连续运行，不因对话结束而中断</p>
      <div class="points">
        <div class="point ${rv(4)}"><h3>监督者统筹</h3><p>拆解目标、调度任务，及时止损低效路径</p></div>
        <div class="point ${rv(5)}"><h3>多路径并行探索</h3><p>启发式数学探索 Agent 同时尝试不同研究思路</p></div>
        <div class="point ${rv(6)}"><h3>随时插入指导</h3><p>研究者可在运行中介入，调整探索方向</p></div>
      </div>
    </div>
    <div class="tree" style="flex:1;padding-top:70px">${treeSvg}</div>
  </div>
</div>`);

// 08 专业工具 -------------------------------------------------------------
const term = [
  ['<span class="c"># 计算核对：Wilson 判据，n = 2 … 200</span>'],
  ['<span class="p">$</span> python3 check_wilson.py --range 2..200'],
  ['checked 199 integers · 46 primes'],
  ['mismatches: <span class="ok">0</span>'],
  ['<span class="p">$</span> sage verify_identities.sage'],
  ['symbolic identities: 6 / 6 <span class="ok">✓</span>'],
  ['<span class="p">$</span> python3 search_counterexample.py --n 4'],
  ['n = 4 · 3! ≡ 2 (mod 4) <span class="c"># 合数例外，已记录</span>'],
  ['<span class="p">$</span> <span class="cursor"></span>'],
];
add('专业工具', 3, `
<div class="content">
  <div class="head">
    ${kick(2)}
    <h2 class="${rv(1)}">专业工具，<span class="hl">贯穿探索全程</span></h2>
    <p class="lead ${rv(2)}">学术检索提供依据，计算实验检验思路——文献证据与实验结果沉淀在同一个课题里。</p>
  </div>
  <div class="row" style="margin-top:34px;height:440px;gap:28px">
    <div class="tool ${rv(3)}" style="flex:1">
      <div class="th">${ico('book')}<div><h3>学术检索</h3><p>检索论文、已有结果与证明线索，引用可追溯</p></div></div>
      <div class="refs">
        <div class="ref"><span class="tag">随机矩阵 · ζ 函数</span><br><b>Keating, J. P., &amp; Snaith, N. C. (2000).</b> “Random matrix theory and ζ(1/2+it).” <i>Communications in Mathematical Physics</i>, 214(1).</div>
        <div class="ref"><span class="tag">L-函数矩</span><br><b>Conrey, J. B., et al. (2005).</b> “Integral moments of L-functions.” <i>Proc. London Math. Soc.</i>, 91(1).</div>
        <div class="ref"><span class="tag">数论基础</span><br><b>Titchmarsh, E. C. (1986).</b> <i>The theory of the Riemann zeta-function.</i> Oxford University Press.</div>
      </div>
    </div>
    <div class="tool ${rv(4)}" style="flex:1">
      <div class="th">${ico('code')}<div><h3>计算与仿真</h3><p>特殊情形、数值实验与反例搜索，检验候选结论</p></div></div>
      <div class="term">${term.map(([l], i) => `<div class="line" style="--i:${i}">${l}</div>`).join('')}</div>
    </div>
  </div>
</div>`);

// 09 协作看板 -------------------------------------------------------------
const sidePoints = (arr, start = 3) => `<div class="points">${arr.map(([t, d], i) => `<div class="point ${rv(start + i)}"><span class="num">0${i + 1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div>`;
add('协作看板', 4, `
<div class="content">
  <div class="head">
    ${kick(3)}
    <h2 class="${rv(1)}">研究者与 Agent，<span class="hl">在同一块看板上协作</span></h2>
  </div>
  <div class="row" style="margin-top:30px;height:520px;gap:44px">
    <div class="${rv(2)}" style="flex:1;display:flex">${await gallery([['board', '课题协作看板', { file: '科研 / 数学 · 看板' }]], { tabs: false })}</div>
    <div style="flex:0 0 300px;padding-top:20px">
      ${sidePoints([['课题统一管理', '黎曼猜想等课题拆成研究方向，在同一项目中组织'], ['研究状态可见', '待规划、待办、进行中、审核中，一目了然'], ['人机协同推进', '成员与智能体同列分工，Agent 工作状态实时可见']])}
    </div>
  </div>
</div>`);

// 10 进度与审核 -----------------------------------------------------------
add('进度与审核', 4, `
<div class="content">
  <div class="head">
    ${kick(3)}
    <h2 class="${rv(1)}">探索过程可见，<span class="hl">关键节点有人把关</span></h2>
  </div>
  <div class="row" style="margin-top:22px;height:560px;gap:44px">
    <div class="${rv(2)}" style="flex:1;display:flex">${await gallery([
      ['review', '关键节点 @ 审核', { file: '收件箱 · 审核清单', pos: 'center' }],
      ['tree', '研究分支探索', { file: '黎曼猜想 · 研究分支树', pos: 'center', contain: true }],
      ['tree-complete', '完整任务节点树', { file: 'OPE-88 · 完整节点树', pos: 'center' }],
    ])}</div>
    <div style="flex:0 0 300px;padding-top:66px">
      ${sidePoints([['探索节点树', '每个分支、子任务与状态都可展开查看'], ['关键节点提醒', '阶段成果主动 @ 研究者，附审核清单'], ['研究者及时介入', '基于阶段材料判断，决定继续、调整或放弃']])}
    </div>
  </div>
</div>`);

// 11 Lean4 定理库与知识图谱（核心能力，深色重点页）--------------------------
// 知识图谱：确定性随机布局，每次构建结果一致；检索动画由 data-tl 时间轴驱动（见 src/deck.js）
function mulberry(seed) {
  return () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const kgSvg = (() => {
  const rnd = mulberry(20261103);
  const gs = () => (rnd() + rnd() + rnd() - 1.5) / 1.5;
  const TX = 410, TY = 300;
  const CL = [
    ['数论', 'NUMBER THEORY', 170, 205, 88], ['有限域', 'FINITE FIELDS', 425, 112, 78], ['群论', 'GROUP THEORY', 660, 150, 84],
    ['组合', 'COMBINATORICS', 128, 385, 72], ['线性代数', 'LINEAR ALGEBRA', 690, 345, 68], ['拓扑', 'TOPOLOGY', 410, 490, 66], ['分析', 'ANALYSIS', 640, 492, 62],
  ];
  const HITS = [
    ['素数与整除', 0, 222, 238], ['Bézout · gcd', 0, 118, 162], ['ZMod p 是域', 1, 458, 138],
    ['x² = 1 ⇒ x = ±1', 1, 362, 84], ['单位群逆元配对', 2, 618, 196], ['有限积 · Finset.prod', 3, 160, 400],
  ];
  // 左上为课题卡、左下为检索结果卡，避开这两块区域
  const blocked = (x, y) => (x < 300 && y < 96) || (x < 300 && y > 462) || Math.hypot(x - TX, y - TY) < 46;
  const nodes = HITS.map(([, c, x, y]) => ({ x, y, c, hit: true }));
  CL.forEach(([, , cx, cy, r], c) => {
    for (let k = 0, tries = 0; k < 40 && tries < 900; tries++) {
      const x = cx + gs() * r * 1.1, y = cy + gs() * r * 0.9;
      if (x < 8 || x > 752 || y < 8 || y > 552 || blocked(x, y) || nodes.some((n) => Math.hypot(n.x - x, n.y - y) < 13)) continue;
      nodes.push({ x, y, c }); k++;
    }
  });
  const edges = new Set();
  const link = (a, b) => edges.add(a < b ? `${a}-${b}` : `${b}-${a}`);
  nodes.forEach((n, i) => {
    const near = nodes.map((m, j) => [j, Math.hypot(m.x - n.x, m.y - n.y), m.c]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]);
    near.filter(([, , c]) => c === n.c).slice(0, 2).forEach(([j]) => link(i, j));
    if (rnd() < 0.14) { const o = near.find(([, , c, ]) => c !== n.c); if (o && o[1] < 150) link(i, o[0]); }
  });
  const f = (v) => v.toFixed(1);
  const edgeSvg = [...edges].map((e) => { const [a, b] = e.split('-').map(Number); return `<path d="M${f(nodes[a].x)} ${f(nodes[a].y)}L${f(nodes[b].x)} ${f(nodes[b].y)}"/>`; }).join('');
  const nodeSvg = nodes.filter((n) => !n.hit).map((n) => { const tw = rnd() < 0.22; return `<circle class="${tw ? 'tw' : ''}" ${tw ? `style="animation-delay:${(-rnd() * 5).toFixed(2)}s"` : ''} cx="${f(n.x)}" cy="${f(n.y)}" r="${(1.3 + rnd() * rnd() * 3).toFixed(1)}"/>`; }).join('');
  const T0 = 1500, STEP = 380, LINK = T0 + HITS.length * STEP + 200, OK = LINK + 1300;
  const hitSvg = HITS.map(([t, , x, y], i) => {
    const mx = (x + TX) / 2, my = (y + TY) / 2, dx = TX - x, dy = TY - y, L = Math.hypot(dx, dy), bend = (i % 2 ? 1 : -1) * L * 0.18;
    const d = `M${x} ${y}Q${f(mx - (dy / L) * bend)} ${f(my + (dx / L) * bend)} ${TX} ${TY}`;
    const right = x < 600;
    return `<g class="kg-hit" data-at="${T0 + i * STEP}">
      <path class="kg-link" pathLength="1" d="${d}" data-at="${LINK + i * 90}"/>
      <circle class="kg-flow" r="2.6"><animateMotion dur="1.6s" begin="${(i * 0.27).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>
      <circle class="kg-halo" cx="${x}" cy="${y}" r="13"/><circle class="kg-hn" cx="${x}" cy="${y}" r="5.5"/>
      <text class="kg-hl" x="${right ? x + 13 : x - 13}" y="${y - 10}" text-anchor="${right ? 'start' : 'end'}">${t}</text>
    </g>`;
  }).join('');
  return `<svg class="kg" viewBox="0 0 760 560" aria-label="Lean4 定理知识图谱检索动画">
    <defs><radialGradient id="kgGlow"><stop offset="0" stop-color="#CDF55A" stop-opacity=".28"/><stop offset="1" stop-color="#CDF55A" stop-opacity="0"/></radialGradient></defs>
    ${CL.map(([zh, en, cx, cy, r]) => `<text class="kg-cl" x="${cx}" y="${cy - r * 0.95}" text-anchor="middle">${zh}<tspan dx="6">${en}</tspan></text>`).join('')}
    <g class="kg-e">${edgeSvg}</g><g class="kg-n">${nodeSvg}</g>
    <circle class="kg-scan" cx="${TX}" cy="${TY}" r="10" data-at="900"/>
    ${hitSvg}
    <g class="kg-target">
      <circle class="kg-glow" cx="${TX}" cy="${TY}" r="90" data-at="${OK}"/>
      <circle class="kg-ring" cx="${TX}" cy="${TY}" r="30"/>
      <g class="kg-q" data-at="700" data-off="${OK}"><circle cx="${TX}" cy="${TY}" r="20"/><text x="${TX}" y="${TY + 7}" text-anchor="middle">?</text></g>
      <g class="kg-ok" data-at="${OK}"><circle cx="${TX}" cy="${TY}" r="21"/><path d="M${TX - 8} ${TY}l5.5 5.5 11-11"/></g>
      <circle class="kg-ripple" cx="${TX}" cy="${TY}" r="21" data-at="${OK + 900}"/>
      <text class="kg-tl" x="${TX}" y="${TY + 50}" text-anchor="middle">Wilson 定理</text>
      <text class="kg-ts" x="${TX}" y="${TY + 68}" text-anchor="middle" data-at="${OK + 900}">已验证 · 回流定理库</text>
    </g>
  </svg>`;
})();
add('Lean4 定理库', 5, `
<div class="content lib">
  <div class="lib-l">
    ${kick(4)}
    <h2 class="${rv(1)}">定理库 × 知识图谱，<br>让验证<em>从复用开始</em></h2>
    <p class="lead ${rv(2)}">我们收集、整理大量 Lean4 库，统一版本并预编译为可直接调用的定理库，再把定理之间的依赖关系构建为知识图谱。</p>
    <div class="feats">
      ${[['book', '可执行定理库', '统一版本、预编译，每条定理可直接 import 并通过编译'], ['tree', '定理知识图谱', '定义、引理与定理的依赖关系结构化，按领域与概念检索'], ['bolt', '检索即复用', '新课题先查图谱，已验证的部分直接调用，只形式化真正新的论证']]
        .map(([k, t, d], i) => `<div class="feat ${rv(3 + i)}">${ico(k)}<div><b>${t}</b><span>${d}</span></div></div>`).join('')}
    </div>
    <div class="cmp ${rv(6)}">
      <div class="cmp-h"><span>同一课题的形式化工作量</span><span class="note">示意</span></div>
      <div class="cmp-r"><span class="cmp-k">从零构建</span><div class="cmp-bar full"><i style="--w:24%">基础定义</i><i style="--w:34%">通用引理</i><i style="--w:16%">环境依赖</i><i class="core" style="--w:26%">核心论证</i></div></div>
      <div class="cmp-r"><span class="cmp-k">复用定理库</span><div class="cmp-bar"><i class="hit" style="--w:7%">检索</i><i class="core" style="--w:26%">核心论证</i><span class="cmp-save">验证周期大幅缩短</span></div></div>
    </div>
  </div>
  <div class="lib-r ${rv(2)}" data-tl data-loop="13000">
    <div class="kg-card q" data-at="300"><span class="kg-ck">NEW PROBLEM · 待验证课题</span><b>Wilson 定理</b><span class="math">n 为素数 ⇔ (n − 1)! ≡ −1 (mod n)</span></div>
    ${kgSvg}
    <div class="kg-card r">
      <span class="kg-ck">图谱检索结果</span>
      <div data-at="1500"><span>命中已验证引理</span><b class="lime">6 条 · 直接复用</b></div>
      <div data-at="4300"><span>需新形式化</span><b>1 项核心论证</b></div>
      <div data-at="5500"><span>内核检查</span><b class="lime">✓ 通过 · 入库</b></div>
    </div>
  </div>
</div>`, { dark: true });

// 12 Lean4 形式化验证：编辑器实时检查动画 + 真实验收截图 -----------------------
const LEAN = [
  ['import Mathlib.FieldTheory.Finite.Basic'],
  [''],
  ['open Nat'],
  [''],
  ['/-- Wilson 定理：n > 1 时，n 为素数 ⇔ (n-1)! ≡ -1 (mod n) -/'],
  ['theorem wilson_iff (n : ℕ) (hn : 1 < n) :'],
  ['    n.Prime ↔ ((n - 1)! : ZMod n) = -1 := by'],
  ['  constructor'],
  ['  · intro hp'],
  ['    haveI := Fact.mk hp            -- ZMod p 是域', 1],
  ['    exact prod_pairing_eq_neg_one n  -- 逆元两两配对'],
  ['  · intro h'],
  ['    by_contra hnp'],
  ['    obtain ⟨d, hd, h2, hl⟩ :=        -- 合数必有真因子'],
  ['      exists_dvd_of_not_prime2 hn hnp', 1],
  ['    exact not_dvd_of_neg_one h hd'],
  ['      (dvd_factorial_sub_one h2 hl)'],
];
const KW = /\b(import|open|theorem|lemma|by|constructor|intro|haveI|exact|by_contra|obtain|fun)\b/g;
function leanHl(src) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  if (src.trim().startsWith('/--')) return `<span class="lc">${esc(src)}</span>`;
  const [code, cm] = src.split(/(?=--)/);
  const body = esc(code).replace(KW, '<span class="lk">$1</span>').replace(/(ℕ|ZMod|Fact|Prime)/g, '<span class="lt">$1</span>').replace(/(?<![\w.])(-?\d+)(?![\w])/g, '<span class="ln">$1</span>');
  return body + (cm ? `<span class="lc">${esc(cm)}</span>` : '');
}
const LT = (i) => 500 + i * 170;
const ivState = (at, off, title, hyps, goal) => `<div class="iv-s" data-at="${at}" ${off ? `data-off="${off}"` : ''}>
  <div class="iv-t">${title}</div>${hyps.map(([h, t]) => `<div class="iv-hy"><b>${h}</b> : ${t}</div>`).join('')}<div class="iv-g"><b>⊢</b> ${goal}</div></div>`;
const leanPane = `<div class="pane lean on" data-file="wilson-lean4 · Main.lean（示意片段）" data-tl>
  <div class="ed">
    <ol class="code">${LEAN.map(([l, lib], i) => `<li data-at="${LT(i)}" class="${lib ? 'reuse' : ''}"><span class="gut">${lib ? '◆' : ''}</span><code>${leanHl(l) || '&nbsp;'}</code></li>`).join('')}</ol>
    <div class="iv">
      <div class="iv-h">Lean Infoview<span>Main.lean</span></div>
      ${ivState(LT(6), LT(9), '1 goal', [['n', 'ℕ'], ['hn', '1 &lt; n']], 'Nat.Prime n ↔ ↑(n - 1)! = -1')}
      ${ivState(LT(9), LT(12), 'case mp', [['n', 'ℕ'], ['hp', 'Nat.Prime n'], ['this', 'Fact (Nat.Prime n)']], '↑(n - 1)! = -1')}
      ${ivState(LT(12), LT(17), 'case mpr', [['h', '↑(n - 1)! = -1'], ['hnp', '¬Nat.Prime n'], ['d', 'ℕ'], ['hd', 'd ∣ n']], 'False')}
      <div class="iv-s done" data-at="${LT(17)}">
        <div class="iv-ok"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg><div><b>No goals</b><span>wilson_iff 通过 Lean 内核检查</span></div></div>
        <div class="iv-ax"><span class="lc">#print axioms wilson_iff</span><br>'wilson_iff' depends on axioms:<br>[<span class="lk">propext</span>, <span class="lk">Classical.choice</span>, <span class="lk">Quot.sound</span>]</div>
      </div>
    </div>
  </div>
  <div class="sb"><span>Lean 4.33.1 · Mathlib 0df444a</span><span class="legend"><i>◆</i>复用定理库中的已验证结果</span><span class="sb-ok" data-at="${LT(17) + 300}">lake build ✓ 12/12 模块 · 61/61 义务</span></div>
</div>`;
const leanShots = await Promise.all([['lean-acceptance', 'Lean 形式化验收记录', true], ['lean-delivery', 'Lean 交付与复现方式', false]]
  .map(async ([n, file, contain]) => `<img class="${contain ? 'contain' : ''}" src="${await shot(n)}" alt="${file}" data-file="${file}" style="object-position:${contain ? 'center' : 'top center'}" loading="lazy">`));
add('Lean4 形式化验证', 5, `
<div class="content">
  <div class="head" style="max-width:none">
    ${kick(4)}
    <h2 class="${rv(1)}">经过 Lean 完整验证，<span class="hl">证明才更容易被认可</span></h2>
    <p class="lead ${rv(2)}" style="max-width:none">审阅者不必逐行核对推导，只需确认定理陈述是否准确——其余每一步都由机器严格检查。</p>
  </div>
  <div class="row" style="margin-top:26px;height:500px;gap:40px">
    <div class="trust">
      ${[['内核逐步检查', '每一步推导都经 Lean 内核检查，没有“显然成立”的跳步'], ['依赖完全透明', '仅依赖 3 条标准公理，引用的每个结论都可追溯'], ['任何人可复现', '锁定 Lean 与 Mathlib 版本，lake build 一键重新验证'], ['成果回流定理库', '通过验证的定理进入知识图谱，供下一个课题复用']]
        .map(([t, d], i) => `<div class="${rv(3 + i)}"><span class="num">0${i + 1}</span><b>${t}</b><span>${d}</span></div>`).join('')}
      <div class="mstats ${rv(7)}">
        ${[['61', '/61', '证明义务全部通过'], ['12', '个', 'Lean 模块'], ['7,681', '', '传递常量依赖审计'], ['57', '/57', 'SHA-256 校验匹配']]
          .map(([v, s, k]) => `<div><div class="v">${v}<small>${s}</small></div><div class="k">${k}</div></div>`).join('')}
      </div>
      <p class="note" style="margin:8px 0 0">数据来自 Wilson 定理示例任务的验收记录。</p>
    </div>
    <div class="gallery ${rv(3)}">
      <div class="tabs" role="tablist">${['实时检查', '验收记录', '交付与复现'].map((t, i) => `<button role="tab" aria-selected="${i === 0}">${t}</button>`).join('')}</div>
      <div class="win nozoom" data-zoom><div class="win-bar"><i></i><i></i><i></i><span class="wt">wilson-lean4 · Main.lean（示意片段）</span><span class="zoom">⤢ 点击放大</span></div>
      <div class="shots">${leanPane}${leanShots.join('')}</div></div>
    </div>
  </div>
</div>`);

// 12 论文与复现 -----------------------------------------------------------
add('论文与复现', 5, `
<div class="content">
  <div class="head">
    ${kick(4)}
    <h2 class="${rv(1)}">每次交付，都<span class="hl">可查看、可复现</span></h2>
  </div>
  <div class="row" style="margin-top:22px;height:560px;gap:40px">
    <div class="${rv(2)}" style="flex:1;display:flex">${await gallery([
      ['paper-abstract', '论文摘要', { file: 'manuscript.pdf · Abstract' }],
      ['paper-proof', '正文与证明', { file: 'manuscript.pdf · §3–4' }],
      ['files', '交付附件', { file: 'OPE-88 · 附件与复现方式' }],
      ['acceptance', '验收记录', { file: '验收记录' }],
    ])}</div>
    <div style="flex:0 0 360px;padding-top:56px;display:flex;flex-direction:column;gap:12px">
      <div class="claim ${rv(3)}">${ico('star')}已证明多个业界多年未解的猜想 / 问题</div>
      <div class="files">
        ${[['manuscript.pdf', '学术论文：摘要、论证与完整证明'], ['reproducible-code.zip', '证明、代码、测试与环境说明'], ['supervision-evidence.zip', '监督报告、节点树、阶段观察与验收']]
          .map(([f, d], i) => `<div class="file ${rv(4 + i)}">${ico('file')}<div><b>${f}</b><span>${d}</span></div></div>`).join('')}
      </div>
      <div class="cmd ${rv(7)}"><span class="p">$</span> python3 -B run_all.py<br><span style="color:#8A887C"># 仅需 Python 3.8+ 标准库，离线可复现</span></div>
    </div>
  </div>
</div>`);

// 13 任务总结 -------------------------------------------------------------
add('完整任务总结', 5, `
<div class="content">
  <div class="head">
    ${kick(4)}
    <h2 class="${rv(1)}">完整任务总结，<span class="hl">研究过程可追溯</span></h2>
  </div>
  <div class="row" style="margin-top:30px;height:540px;gap:44px">
    <div class="${rv(2)}" style="flex:1;display:flex">${await gallery([['summary', '监督与交付报告', { file: 'supervision-report.md' }]], { tabs: false })}</div>
    <div style="flex:0 0 340px;padding-top:6px">
      <p class="num ${rv(3)}" style="margin:0 0 18px">案例回顾 · Wilson 定理</p>
      <ol class="timeline">
        ${[['锁定研究起点', '命题、量词与证明责任冻结为契约'], ['计算核对', 'Python + SageMath：199 个整数、46 个素数逐条一致'], ['独立审稿', '审稿 Agent 复核完整证明与论文，无新发现问题'], ['论文编译', 'Markdown / LaTeX / PDF 三种格式，零告警'], ['形式化验收', 'Lean4 61 项义务全部通过'], ['打包交付', '全新目录一键复现，文件哈希全部一致']]
          .map(([t, d], i) => `<li class="done ${rv(4 + i)}"><b>${t}</b><span>${d}</span></li>`).join('')}
      </ol>
    </div>
  </div>
</div>`);

// 14 机构申请：持续运转的科研流水线闭环（纯 SVG/SMIL 动画）
const T = 9, CX = 300, CY = 220, R = 160;
const loopNodes = [['提出问题', 0], ['自主探索', 90], ['人机协作', 180], ['验证交付', 270]];
const ringPath = `M${CX} ${CY - R}A${R} ${R} 0 1 1 ${CX} ${CY + R}A${R} ${R} 0 1 1 ${CX} ${CY - R}`;
const loopSvg = `<svg class="loop" viewBox="0 0 600 440" aria-label="持续运转的科研流水线">
  <defs><radialGradient id="lg"><stop offset="0" stop-color="#CDF55A" stop-opacity=".35"/><stop offset="1" stop-color="#CDF55A" stop-opacity="0"/></radialGradient></defs>
  <circle cx="${CX}" cy="${CY}" r="120" fill="url(#lg)" opacity=".5"/>
  <g class="loop-rot"><circle cx="${CX}" cy="${CY}" r="${R + 34}" class="loop-outer"/></g>
  <g class="loop-rot rev"><circle cx="${CX}" cy="${CY}" r="${R - 42}" class="loop-inner"/></g>
  ${Array.from({ length: 72 }, (_, k) => { const a = k / 72 * Math.PI * 2; const r1 = R + 14, r2 = R + (k % 6 ? 18 : 24); return `<path class="loop-tick" d="M${(CX + Math.cos(a) * r1).toFixed(1)} ${(CY + Math.sin(a) * r1).toFixed(1)}L${(CX + Math.cos(a) * r2).toFixed(1)} ${(CY + Math.sin(a) * r2).toFixed(1)}"/>`; }).join('')}
  <path class="loop-ring" d="${ringPath}"/>
  ${[0, 1, 2].map((k) => `<g><circle r="16" fill="url(#lg)"/><circle r="5.5" class="loop-p"/><animateMotion dur="${T}s" begin="${-k * T / 3}s" repeatCount="indefinite" path="${ringPath}"/></g>`).join('')}
  ${loopNodes.map(([t, deg], i) => {
    const a = (deg - 90) * Math.PI / 180, x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R;
    const phase = ((deg / 360) * T) % (T / 3);
    const lx = x + Math.cos(a) * 52, ly = y + Math.sin(a) * 52 + 6;
    const anchor = Math.abs(Math.cos(a)) < .1 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    return `<circle cx="${x}" cy="${y}" r="27" class="loop-node"/>
      <circle cx="${x}" cy="${y}" r="27" class="loop-flash" opacity="0"><animate attributeName="opacity" values="1;0;0" keyTimes="0;.45;1" dur="${T / 3}s" begin="${phase.toFixed(2)}s" repeatCount="indefinite"/></circle>
      <text x="${x}" y="${y + 5}" class="loop-n" text-anchor="middle">0${i + 1}</text>
      <text x="${(anchor === 'middle' ? x : x + Math.cos(a) * 46).toFixed(1)}" y="${(anchor === 'middle' ? ly : y + 6).toFixed(1)}" class="loop-l" text-anchor="${anchor}">${t}</text>`;
  }).join('')}
  <text x="${CX}" y="${CY - 34}" class="loop-k" text-anchor="middle">DISCOVERY LOOP</text>
  <text x="${CX}" y="${CY + 22}" class="loop-big" text-anchor="middle">7×24</text>
  <text x="${CX}" y="${CY + 54}" class="loop-s" text-anchor="middle">流水线持续运转</text>
</svg>`;
add('机构申请', 0, `
<div class="content closing">
  <p class="kicker ${rv(0)}" style="margin-top:20px">Thank you</p>
  <h1 class="title ${rv(1)}">构建科学发现的<br><em>流水线</em></h1>
  <p class="lead ${rv(2)}" style="max-width:600px;margin-top:26px">问题从一端投入，经过验证的成果从另一端产出——<br>每一份成果，又成为下一个问题的起点。</p>
  <div class="${rv(3)}" style="margin:34px 0 0"><span class="badge"><i></i>目前仅面向科研机构开放申请</span></div>
  <div class="${rv(2)}" style="position:absolute;right:-10px;top:-24px;width:600px;height:440px">${loopSvg}</div>
  <div style="position:absolute;left:0;right:0;bottom:0">
    <p class="num ${rv(4)}" style="color:var(--on-night-2);margin:0 0 16px">申请沟通时，建议准备</p>
    <div class="apply">
      ${[['机构与团队', '所属机构、团队规模与成员背景'], ['研究方向', '所在学科与重点关注领域'], ['拟探索课题', '希望交给 Agent 推进的具体问题'], ['算力需求', '预估计算规模与运行周期']]
        .map(([t, d], i) => `<div class="${rv(5 + i)}"><span class="num">0${i + 1}</span><b>${t}</b><span>${d}</span></div>`).join('')}
    </div>
  </div>
</div>`, { dark: true, desc: '目前仅支持机构申请使用' });


// ---------- 组装 ----------
const N = slides.length;
const pad = (n) => String(n).padStart(2, '0');
const sectionLabel = (s) => (s ? `<span class="sec">0${s} · <b>${SECTIONS[s]}</b></span>` : '<span class="sec"></span>');
const svgIcon = (d) => `<svg class="ico" viewBox="0 0 24 24"><path d="${d}"/></svg>`;

const css = await read('src/deck.css', 'utf8');
const js = await read('src/deck.js', 'utf8');

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>矩阵工坊 · 构建科学发现的流水线</title>
<meta name="description" content="矩阵工坊：面向数学研究的 AI 科研 Agent，构建科学发现的流水线。目前仅支持机构申请使用。">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700;900&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<main class="viewport"><div class="stage" id="stage">
${slides.map((s, i) => `<section class="slide ${s.dark ? 'dark' : ''}${i === 0 ? ' active' : ''}" id="slide-${i + 1}" data-name="${s.name}" aria-label="${s.name}" aria-hidden="${i !== 0}">
${s.body}
<div class="pageno">${pad(i + 1)} / ${pad(N)}</div>
</section>`).join('\n')}
</div></main>
<nav class="toolbar" aria-label="演示控制">
  <div class="grp"><button id="ovbtn" aria-label="目录 (G)">${svgIcon('M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z')}</button><span class="curname" id="curname"></span></div>
  <div class="progress"><i id="bar"></i></div>
  <div class="grp"><button id="prev" aria-label="上一页">${svgIcon('m15 6-6 6 6 6')}</button><span class="counter" id="counter"></span><button id="next" aria-label="下一页">${svgIcon('m9 6 6 6-6 6')}</button><button id="fs" aria-label="全屏 (F)">${svgIcon('M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5')}</button></div>
</nav>
<aside class="overview" id="overview" aria-label="演示目录">
  <button class="ov-close" aria-label="关闭目录">×</button>
  <h2>演示目录</h2>
  <div class="ov-grid">${slides.map((s, i) => `<button data-go="${i}"><span>${pad(i + 1)}${s.sec ? ' · ' + SECTIONS[s.sec] : ''}</span><b>${s.name}</b></button>`).join('')}</div>
</aside>
<script>${js}</script>
</body>
</html>`;

await fs.writeFile(ROOT + 'index.html', html);
console.log(`Created ${N} slides → index.html (${(html.length / 1048576).toFixed(1)} MB)`);
