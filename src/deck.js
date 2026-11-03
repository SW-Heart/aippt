(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.getElementById('stage');
  const $ = (id) => document.getElementById(id);
  let current = 0;

  function resize() {
    const full = document.body.classList.contains('fs');
    const pad = full || innerWidth < 760 ? 0 : 1;
    const s = Math.min((innerWidth - pad * 48) / 1440, (innerHeight - (full ? 0 : 56) - pad * 32) / 810);
    stage.style.transform = `scale(${s})`;
  }
  addEventListener('resize', resize);
  // 全屏时隐藏底部操作栏，舞台铺满屏幕；Esc 由浏览器退出全屏
  document.addEventListener('fullscreenchange', () => {
    document.body.classList.toggle('fs', !!document.fullscreenElement);
    resize();
  });
  resize();

  function go(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, j) => {
      const on = j === current;
      s.classList.toggle('active', on);
      s.setAttribute('aria-hidden', String(!on));
      timeline(s, on);
    });
    const n = String(current + 1).padStart(2, '0');
    $('counter').textContent = `${n} / ${String(slides.length).padStart(2, '0')}`;
    $('curname').textContent = slides[current].dataset.name;
    $('bar').style.width = `${((current + 1) / slides.length) * 100}%`;
    $('prev').disabled = current === 0;
    $('next').disabled = current === slides.length - 1;
    document.querySelectorAll('.ov-grid button').forEach((b, j) => b.setAttribute('aria-current', String(j === current)));
    history.replaceState(null, '', '#' + (current + 1));
    $('overview').classList.remove('open');
  }
  window.go = go;

  // 时间轴：[data-tl] 容器进入页面后，按子元素的 data-at / data-off（毫秒）添加、移除 .on；data-loop 时循环播放
  const tlTimers = new Map();
  function timeline(slide, on) {
    slide.querySelectorAll('[data-tl]').forEach((root) => {
      (tlTimers.get(root) || []).forEach(clearTimeout);
      const items = [...root.querySelectorAll('[data-at]')];
      items.forEach((el) => el.classList.remove('on'));
      if (!on) return;
      const play = () => {
        const t = [];
        items.forEach((el) => {
          el.classList.remove('on');
          t.push(setTimeout(() => el.classList.add('on'), Number(el.dataset.at)));
          if (el.dataset.off) t.push(setTimeout(() => el.classList.remove('on'), Number(el.dataset.off)));
        });
        if (root.dataset.loop) t.push(setTimeout(play, Number(root.dataset.loop)));
        tlTimers.set(root, t);
      };
      play();
    });
  }
  // 打印 / 导出 PDF 时直接显示时间轴的最终状态
  addEventListener('beforeprint', () => {
    tlTimers.forEach((t) => t.forEach(clearTimeout));
    document.querySelectorAll('[data-tl] [data-at]').forEach((el) => el.classList.toggle('on', !el.dataset.off));
  });

  $('prev').onclick = () => go(current - 1);
  $('next').onclick = () => go(current + 1);
  document.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => go(Number(b.dataset.go))));
  $('ovbtn').onclick = () => $('overview').classList.toggle('open');
  document.querySelector('.ov-close').onclick = () => $('overview').classList.remove('open');
  $('fs').onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {}
  };

  // zoom dialog
  const dlg = document.createElement('dialog');
  dlg.className = 'zoomer';
  dlg.innerHTML = '<button class="zc" aria-label="关闭">×</button><span class="zh">点击图片切换原始尺寸 · Esc 关闭</span><img alt="">';
  document.body.append(dlg);
  const dimg = dlg.querySelector('img');
  dlg.querySelector('.zc').onclick = () => dlg.close();
  dimg.onclick = () => dlg.classList.toggle('full');
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  function zoom(img) {
    dimg.src = img.src; dimg.alt = img.alt;
    dlg.classList.remove('full'); dlg.scrollTo(0, 0); dlg.showModal();
  }
  document.querySelectorAll('[data-zoom]').forEach((el) =>
    el.addEventListener('click', () => {
      const on = el.querySelector('.shots > .on');
      const img = on ? (on.tagName === 'IMG' ? on : null) : el.querySelector('img');
      if (img) zoom(img);
    })
  );

  // galleries
  document.querySelectorAll('.gallery').forEach((g) => {
    const tabs = [...g.querySelectorAll('.tabs button')];
    const panes = [...g.querySelectorAll('.shots > *')];
    const wt = g.querySelector('.wt');
    const win = g.querySelector('.win');
    tabs.forEach((t, i) => (t.onclick = () => {
      tabs.forEach((x, j) => x.setAttribute('aria-selected', String(i === j)));
      panes.forEach((x, j) => x.classList.toggle('on', i === j));
      if (wt) wt.textContent = panes[i].dataset.file;
      win.classList.toggle('nozoom', panes[i].tagName !== 'IMG');
    }));
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.altKey || ev.metaKey || ev.ctrlKey || dlg.open) return;
    if (['ArrowRight', 'PageDown', ' ', 'ArrowDown'].includes(ev.key)) { ev.preventDefault(); go(current + 1); }
    if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(ev.key)) { ev.preventDefault(); go(current - 1); }
    if (ev.key === 'Home') go(0);
    if (ev.key === 'End') go(slides.length - 1);
    if (ev.key === 'Escape') {
      $('overview').classList.remove('open');
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }
    if (ev.key === 'g' || ev.key === 'o') $('overview').classList.toggle('open');
    if (ev.key === 'f') $('fs').click();
  });

  let tx = 0, ty = 0;
  const vp = document.querySelector('.viewport');
  vp.addEventListener('touchstart', (e) => { tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; }, { passive: true });
  vp.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  // 封面流水线：研究件沿传送带依次穿过 4 个工位，每过一个工位就变形一次（? → ∑ → ∫ → ✓ → ∎）
  document.querySelectorAll('svg.pipe').forEach((svg) => {
    const NS = 'http://www.w3.org/2000/svg';
    const layer = svg.querySelector('.pl-tokens');
    const counter = svg.querySelector('.pl-count');
    const sts = [...svg.querySelectorAll('.pl-st')].map((g) => ({ g, x: Number(g.dataset.x) }));
    const slide = svg.closest('.slide');
    const GLYPH = ['?', '∑', '∫', '✓', '∎'];
    const SPEED = 110, GAP = 1.9, END = 1330;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let toks = [], spawn = 0, last = 0, done = 0;
    const stageOf = (x) => sts.filter((s) => x > s.x).length;
    function make(x) {
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = '<rect x="-14" y="-16" width="28" height="32" rx="5"/><text y="6"></text>';
      layer.append(g);
      const tk = { g, x, s: -1, t: g.querySelector('text') };
      place(tk);
      return tk;
    }
    function place(tk) {
      const s = stageOf(tk.x);
      if (s !== tk.s) { tk.s = s; tk.g.setAttribute('class', 'pl-tok s' + s); tk.t.textContent = GLYPH[s]; }
      tk.g.setAttribute('transform', `translate(${tk.x.toFixed(1)} 160)`);
    }
    for (let x = END - 40; x > -20; x -= SPEED * GAP) toks.push(make(x));
    function frame(now) {
      requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (!slide.classList.contains('active') || document.hidden) return;
      const v = reduced ? SPEED * 0.3 : SPEED;
      spawn += dt * v;
      if (spawn > SPEED * GAP) { spawn = 0; toks.push(make(-20)); }
      const on = new Set();
      toks = toks.filter((tk) => {
        tk.x += v * dt;
        if (tk.x > END) {
          tk.g.remove();
          counter.textContent = String(++done).padStart(3, '0');
          return false;
        }
        place(tk);
        sts.forEach((s, i) => { if (Math.abs(tk.x - s.x) < 54) on.add(i); });
        return true;
      });
      sts.forEach((s, i) => s.g.classList.toggle('on', on.has(i)));
    }
    requestAnimationFrame(frame);
  });

  go(Number(location.hash.slice(1) || 1) - 1);
})();
