(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const stage = document.getElementById('stage');
  const $ = (id) => document.getElementById(id);
  let current = 0;

  function resize() {
    const s = Math.min((innerWidth - (innerWidth < 760 ? 0 : 48)) / 1440, (innerHeight - 56 - (innerWidth < 760 ? 0 : 32)) / 810);
    stage.style.transform = `scale(${s})`;
  }
  addEventListener('resize', resize);
  resize();

  function go(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((s, j) => {
      const on = j === current;
      s.classList.toggle('active', on);
      s.setAttribute('aria-hidden', String(!on));
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
    el.addEventListener('click', () => zoom(el.querySelector('img.on') || el.querySelector('img')))
  );

  // galleries
  document.querySelectorAll('.gallery').forEach((g) => {
    const tabs = [...g.querySelectorAll('.tabs button')];
    const imgs = [...g.querySelectorAll('.shots img')];
    const wt = g.querySelector('.wt');
    tabs.forEach((t, i) => (t.onclick = () => {
      tabs.forEach((x, j) => x.setAttribute('aria-selected', String(i === j)));
      imgs.forEach((x, j) => x.classList.toggle('on', i === j));
      if (wt) wt.textContent = imgs[i].dataset.file;
    }));
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.altKey || ev.metaKey || ev.ctrlKey || dlg.open) return;
    if (['ArrowRight', 'PageDown', ' ', 'ArrowDown'].includes(ev.key)) { ev.preventDefault(); go(current + 1); }
    if (['ArrowLeft', 'PageUp', 'ArrowUp'].includes(ev.key)) { ev.preventDefault(); go(current - 1); }
    if (ev.key === 'Home') go(0);
    if (ev.key === 'End') go(slides.length - 1);
    if (ev.key === 'Escape') $('overview').classList.remove('open');
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

  go(Number(location.hash.slice(1) || 1) - 1);
})();
