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
const SECTIONS = ['', '问题与方案', '提出问题', '自主探索', '人机协作', '验证交付'];
const rv = (i) => `rv d${i}`;

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

// 01 封面 ---------------------------------------------------------------
add('封面', 0, `
<div class="content cover">
  <div style="position:absolute;left:0;top:70px;width:560px">
    <p class="kicker ${rv(0)}">AI Research Agent · 面向数学研究</p>
    <h1 class="title ${rv(1)}">矩阵工坊</h1>
    <p class="sub ${rv(2)}">构建科学发现的流水线</p>
    <p class="lead ${rv(3)}">让 AI 持续检索、探索、计算与验证，<br>让研究者专注于提出问题、判断方向。</p>
  </div>
  <button class="shot ${rv(2)}" data-zoom aria-label="放大查看产品主页"><img src="${await asset('product.png')}" alt="矩阵工坊产品主页"></button>
  <div class="flow">
    ${[['提出问题', '定义目标、约束与验证方式'], ['自主探索', '长周期运行，多路径并行尝试'], ['人机把关', '进度可见，关键节点人工审核'], ['验证交付', 'Lean4 检查，论文与复现材料']]
      .map(([t, d], i) => `<div class="st" style="--i:${i}"><span class="num">0${i + 1}</span><b>${t}</b><span>${d}</span></div>`).join('')}
  </div>
</div>`, { dark: true, desc: '构建科学发现的流水线' });

// 02 问题 ---------------------------------------------------------------
add('AI 科研的最后一公里', 1, `
<div class="content">
  <div class="head">
    <p class="kicker ${rv(0)}">01 · 问题</p>
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
  ['验证交付', '机器可检查的证明，可复现的成果', [['Lean4 验证', 11], ['论文与复现', 12], ['任务总结', 13]]],
];
add('一条流水线', 1, `
<div class="content">
  <div class="head">
    <p class="kicker ${rv(0)}">产品全景</p>
    <h2 class="${rv(1)}">一条流水线，从研究问题到<span class="hl">可验证的成果</span></h2>
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
add('定义研究问题', 2, `
<div class="content">
  <div class="row" style="gap:56px;height:100%">
    <div style="flex:0 0 560px">
      <p class="kicker ${rv(0)}">02 · 提出问题</p>
      <h2 class="${rv(1)}">从一个<span class="hl">边界清晰</span>的<br>研究问题开始</h2>
      <p class="lead ${rv(2)}" style="margin-bottom:28px">写清目标、已有材料、约束与验证方式，Agent 才能长时间自主推进而不跑偏。</p>
      <div class="tasks">
        ${[['search', '猜想与证明路径探索', '尝试候选思路，推进研究论证'], ['flask', '计算实验与反例搜索', '检验特殊情形与候选结论'], ['check', '已有推导的形式化验证', '将证明整理为机器可检查的文件'], ['file', '论文与证明材料整理', '归纳研究过程与阶段结果']]
          .map(([k, t, d], i) => `<div class="t ${rv(3 + i)}">${ico(k)}<div><b>${t}</b><span>${d}</span></div></div>`).join('')}
      </div>
    </div>
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-bottom:20px">
      <div class="ticket ${rv(3)}">
        <div class="tb"><span class="tag lime">课题</span><b>Wilson 定理：完整证明与形式化</b><span style="margin-left:auto">OPE-88</span></div>
        <dl>
          <div><dt>研究问题</dt><dd>对任意整数 n &gt; 1，<span class="math">n 为素数 ⇔ (n − 1)! ≡ −1 (mod n)</span></dd></div>
          <div><dt>已有材料</dt><dd>原始证明、论文草稿与计算代码</dd></div>
          <div><dt>约束条件</dt><dd>两个方向均需独立证明，不调用 Mathlib 中现成的 Wilson 定理</dd></div>
          <div><dt>验证方式</dt><dd>Python / SageMath 计算核对 + Lean4 形式化检查</dd></div>
          <div><dt>预期交付</dt><dd>论文 PDF、Lean 工程、可复现代码包</dd></div>
          <div><dt>负责人</dt><dd>研究者 · 关键节点 @ 审核</dd></div>
        </dl>
      </div>
      <p class="note" style="margin-top:12px">示例课题：Wilson 定理为经典结果，此处用于完整展示流程。</p>
    </div>
  </div>
</div>`);

// 06 科研环境 -------------------------------------------------------------
add('科研环境', 3, `
<div class="content">
  <div class="row" style="gap:64px;height:100%">
    <div style="flex:0 0 520px">
      <p class="kicker ${rv(0)}">03 · 自主探索</p>
      <h2 class="${rv(1)}">科研环境，<span class="hl">打开即用</span></h2>
      <p class="lead ${rv(2)}" style="margin-bottom:40px">软件、算力与模型已就绪，研究者直接进入课题，不必先当运维。</p>
      <div class="points">
        <div class="point ${rv(3)}"><h3>独立云端沙盒</h3><p>无需本地预装，每个课题在独立环境中运行</p></div>
        <div class="point ${rv(4)}"><h3>高性能 GPU 计算</h3><p>为计算密集的研究任务提供算力</p></div>
        <div class="point ${rv(5)}"><h3>模型自由选择</h3><p>GPT、Claude 等模型按研究需要切换</p></div>
        <div class="point ${rv(6)}"><h3>研究数据隐私隔离</h3><p>课题数据仅在所属环境内流转</p></div>
      </div>
    </div>
    <div style="flex:1;padding-top:40px">
      <div class="sandbox ${rv(3)}">
        <div class="label">${ico('lock')} SANDBOX · 课题独立环境</div>
        <div class="layer"><span class="ln">模型</span><div class="chips"><span class="chip dark">GPT</span><span class="chip dark">Claude</span><span class="chip">更多模型…</span></div></div>
        <div class="layer"><span class="ln">Agent</span><div class="chips"><span class="chip lime">监督者</span><span class="chip lime">探索 Agent ×N</span><span class="chip lime">审稿 Agent</span></div></div>
        <div class="layer"><span class="ln">工具链</span><div class="chips"><span class="chip">Python</span><span class="chip">SageMath</span><span class="chip">Lean4 + Mathlib</span><span class="chip">LaTeX</span><span class="chip">学术检索</span></div></div>
        <div class="layer"><span class="ln">算力</span><div class="gpu">${Array.from({ length: 8 }, (_, i) => `<i style="--i:${i}"></i>`).join('')}</div><span></span></div>
        <div class="layer"><span class="ln">数据</span><div class="chips"><span class="chip">${ico('shield').replace('class="ico"', 'class="ico" style="width:16px;height:16px;vertical-align:-3px"')} 课题数据隔离存储</span></div></div>
      </div>
    </div>
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
      <p class="kicker ${rv(0)}">03 · 自主探索</p>
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
    <p class="kicker ${rv(0)}">03 · 自主探索</p>
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
    <p class="kicker ${rv(0)}">04 · 人机协作</p>
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
    <p class="kicker ${rv(0)}">04 · 人机协作</p>
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

// 11 Lean4 -------------------------------------------------------------
add('Lean4 形式化验证', 5, `
<div class="content">
  <div class="row" style="gap:52px;height:100%">
    <div style="flex:0 0 520px">
      <p class="kicker ${rv(0)}">05 · 验证交付</p>
      <h2 class="${rv(1)}">Lean4 形式化验证，<br><span class="hl">让证明经得起机器检查</span></h2>
      <p class="lead ${rv(2)}" style="margin-bottom:30px">自建并预编译 Lean4 库，逐项检查证明义务，交付可在全新目录独立复现的工程。</p>
      <div class="stats ${rv(3)}">
        <div class="stat"><div class="v">61<small>/61</small></div><div class="k">证明义务精确类型检查<br>全部通过</div></div>
        <div class="stat"><div class="v">12<small>个</small></div><div class="k">Lean 模块，含主证明、<br>联合导入与验证入口</div></div>
        <div class="stat"><div class="v">7,681</div><div class="k">传递常量完成依赖审计，<br>仅用 3 条标准公理</div></div>
        <div class="stat"><div class="v">57<small>/57</small></div><div class="k">交付文件 SHA-256<br>校验全部匹配</div></div>
      </div>
      <p class="note" style="margin-top:14px">数据来自 Wilson 定理示例任务的验收记录。</p>
    </div>
    <div class="${rv(3)}" style="flex:1;display:flex;padding-top:8px">${await gallery([
      ['lean-acceptance', '验收结果', { file: 'Lean 形式化验收', contain: true, pos: 'center' }],
      ['lean-delivery', '交付与复现方式', { file: 'Lean 交付文件' }],
    ])}</div>
  </div>
</div>`);

// 12 论文与复现 -----------------------------------------------------------
add('论文与复现', 5, `
<div class="content">
  <div class="head">
    <p class="kicker ${rv(0)}">05 · 验证交付</p>
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
    <p class="kicker ${rv(0)}">05 · 验证交付</p>
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

// 14 机构申请 -------------------------------------------------------------
add('机构申请', 0, `
<div class="content closing">
  <p class="kicker ${rv(0)}" style="margin-top:20px">Thank you</p>
  <h1 class="title ${rv(1)}">构建科学发现的<br><em>流水线</em></h1>
  <div class="${rv(2)}" style="margin:56px 0 0"><span class="badge"><i></i>目前仅面向科研机构开放申请</span></div>
  <div style="position:absolute;left:0;right:0;bottom:0">
    <p class="num ${rv(3)}" style="color:var(--on-night-2);margin:0 0 16px">申请沟通时，建议准备</p>
    <div class="apply">
      ${[['机构与团队', '所属机构、团队规模与成员背景'], ['研究方向', '所在学科与重点关注领域'], ['拟探索课题', '希望交给 Agent 推进的具体问题'], ['算力需求', '预估计算规模与运行周期']]
        .map(([t, d], i) => `<div class="${rv(4 + i)}"><span class="num">0${i + 1}</span><b>${t}</b><span>${d}</span></div>`).join('')}
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
<div class="chrome"><span class="brand"><span class="brand-mark">M</span>矩阵工坊 · MatFoundry</span>${sectionLabel(s.sec)}</div>
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
