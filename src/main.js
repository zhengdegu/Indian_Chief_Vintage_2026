import './style.css';
import { specGroups, sources, projectNote, specificationNote } from './content.js';
import { createExperience } from './scene.js';

const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const play = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m7 4 9 6-9 6V4Z" fill="currentColor"/></svg>';
const close = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.5"/></svg>';
const rotate = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 8a9 9 0 1 0 .5 7M20 3v5h-5" stroke="currentColor" stroke-width="1.5"/></svg>';
const cameraIcon = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5 6 8H3v12h18V8h-3l-2-3H8Z" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.4"/></svg>';
const names = ['序幕', '雷霆之心', '经典细节', '巡航姿态', '限量传奇'];
const ids = ['overview', 'engine', 'craft', 'chassis', 'edition'];

document.querySelector('#app').innerHTML = `
  <a class="skip-link" href="#engine">跳至车型介绍</a>
  <header class="site-header">
    <a class="brand" href="#overview" aria-label="Indian Motorcycle 返回开场"><span class="brand-script">Indian</span><span class="brand-small">MOTORCYCLE</span></a>
    <nav class="main-nav" aria-label="章节导航"><a href="#overview" class="is-current">概览</a><a href="#engine">动力</a><a href="#craft">设计</a><a href="#chassis">底盘</a></nav>
    <button class="header-cta" data-specs>车型参数 <span>↗</span></button>
  </header>

  <div id="stage" class="stage" role="img" aria-label="Indian Chief Vintage 摩托车交互式三维模型">
    <div class="stage-halo"></div><canvas id="scene-canvas" aria-hidden="true"></canvas>
    <img class="fallback-poster" src="/images/poster.webp" alt="红色与奶油白双色 Chief Vintage 摩托车" />
    <div class="stage-vignette"></div>
  </div>
  <div class="ambient-word" aria-hidden="true">LEGACY</div>
  <div class="chapter-rail" aria-label="章节选择">${ids.map((id, i) => `<button data-chapter="${i}" aria-label="${names[i]}" ${i === 0 ? 'aria-current="step"' : ''}><span>0${i + 1}</span><i></i></button>`).join('')}</div>
  <div class="tour-hud" hidden><span class="live-dot"></span><span>CHIEF VINTAGE — THE FILM</span><span id="tour-time">00:00 / 00:30</span><button id="tour-pause">暂停</button><button id="tour-close" aria-label="退出镜头展演">${close}</button><div id="tour-progress"></div></div>

  <main id="story">
    <section class="chapter hero" id="overview" aria-labelledby="hero-title">
      <div class="hero-heading"><p class="eyebrow"><span class="tiny-diamond"></span> 2026 COLLECTION <span class="eyebrow-line"></span> STURGIS, SD EDITION</p><h1 id="hero-title">CHIEF<span>Vintage</span></h1></div>
      <div class="edition-stamp"><span>ONE OF</span><strong>125</strong><span>LIMITED EDITION</span></div>
      <div class="hero-copy"><span class="section-index">01 / THE BEGINNING</span><h2>一段传奇，<br>新的回响。</h2><p>经典轮廓，雷霆之心。<br>从 Sturgis 出发，让公路记住你。</p><button class="film-button" id="play-film"><span class="play-circle">${play}</span><span>播放镜头展演<small>30 SECOND EXPERIENCE</small></span></button></div>
      <div class="hero-bottom"><a href="#engine" class="scroll-cue"><span class="scroll-line"></span>向下滚动，走近传奇</a><span>1890 cc <b>·</b> THUNDERSTROKE 116</span></div>
    </section>

    <section class="chapter engine" id="engine" aria-labelledby="engine-title">
      <div class="chapter-copy"><p class="eyebrow">02 — THUNDERSTROKE 116</p><h2 id="engine-title">不止心跳。<br><em>是雷霆。</em></h2><p class="body-copy">49° V 型双缸，风冷的机械本色。<br>每一道散热鳍片，每一根推杆，<br>都让力量有了可以看见的形状。</p><div class="hero-metric"><span>1,890</span><small>cc</small><p>THUNDERSTROKE 116 · 风冷 V 型双缸</p></div><div class="inline-metric"><strong>156 <span>N·m</span></strong><span>最大扭矩</span></div><button class="text-button" data-view="engine">靠近机械之心 ${arrow}</button></div>
      <span class="chapter-watermark" aria-hidden="true">116</span>
      <div class="part-caption"><span>01 — 49° V-TWIN</span><i></i><p>银色缸盖 / 黑色散热鳍片</p></div>
    </section>

    <section class="chapter craft" id="craft" aria-labelledby="craft-title">
      <div class="chapter-copy copy-right"><p class="eyebrow">03 — THE ART OF DETAIL</p><h2 id="craft-title">经典，<br>藏在细节里。</h2><p class="body-copy">Indian Red 与 Cream 的相遇，<br>彩色羽冠的鲜明印记，<br>以及 Espresso 皮革独座的温度。</p><div class="paint-swatches" aria-label="实车双色涂装"><span class="swatch red"></span><span class="swatch cream"></span><div>INDIAN RED / CREAM<small>特别版双色涂装</small></div></div><button class="detail-card" id="open-detail"><img src="/images/craft-detail.webp" alt="油箱羽冠徽标与皮革座椅细节" loading="lazy"/><span>近看，才懂<small>探索皮革与涂装</small></span><i>↗</i></button></div>
      <span class="chapter-watermark" aria-hidden="true">CRAFT</span>
      <div class="part-caption caption-left"><span>02 — VINTAGE ESPRESSO</span><i></i><p>皮革独座 / 双排缝线</p></div>
    </section>

    <section class="chapter chassis" id="chassis" aria-labelledby="chassis-title">
      <div class="chapter-copy"><p class="eyebrow">04 — OWN THE HORIZON</p><h2 id="chassis-title">低伏于地。<br><em>心向远方。</em></h2><p class="body-copy">舒展的轴距，低矮的独座。<br>深裙边挡泥板沿着车轮落下，<br>一眼便认得的巡航姿态。</p><div class="dual-metrics"><div><strong>1,626<small>mm</small></strong><span>轴距</span></div><div><strong>686<small>mm</small></strong><span>座高</span></div></div><span class="fine-rule"></span><p class="technical-line">16 英寸辐条轮 <span>／</span> 双后减震器</p><button class="text-button" data-view="profile">切换纯粹侧影 ${arrow}</button></div>
      <span class="chapter-watermark" aria-hidden="true">HORIZON</span>
    </section>

    <section class="chapter edition" id="edition" aria-labelledby="edition-title">
      <div class="edition-heading"><p class="eyebrow">05 — STURGIS, SOUTH DAKOTA</p><h2 id="edition-title">只为 <em>125</em> 位骑士。</h2><p>为第 86 届 Sturgis 盛会而来。<br>让一个时代的精神，在下一个转弯继续。</p></div>
      <div class="edition-bottom"><span class="edition-mark">56</span><div><span class="eyebrow">A SIGNATURE OF STURGIS</span><p>专属侧盖图形，属于这一刻的印记。</p></div><button class="outline-button" data-specs>探索完整参数 ${arrow}</button></div>
    </section>
  </main>

  <div class="viewer-controls"><span id="viewer-hint">拖动，探索另一面</span><div class="control-pill"><button id="explore-toggle" aria-pressed="false">${rotate}<span>自由探索</span></button><span class="control-divider"></span><button id="spin-toggle" aria-label="开启自动环绕" aria-pressed="false">${play}</button><button id="capture" aria-label="保存当前视角图片" title="保存当前视角">${cameraIcon}</button></div></div>
  <div class="load-status" role="status" aria-live="polite"><span class="loading-line"></span><span id="load-label">展厅准备中</span><span id="load-percent">0%</span></div>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>

  <footer><div class="footer-brand"><span class="brand-script">Indian</span><span>CHIEF VINTAGE<br>STURGIS, SD EDITION</span></div><p>THE ROAD GOES ON.</p><div><span>非官方 3D 概念展示 · 2026</span><a href="${sources[0].url}" target="_blank" rel="noopener noreferrer">车型官方资料 ↗</a></div></footer>

  <dialog id="spec-dialog" aria-labelledby="spec-title"><div class="dialog-head"><div><p class="eyebrow">THE DETAILS THAT MATTER</p><h2 id="spec-title">传奇的另一面。<span>车型参数</span></h2></div><button class="icon-button" data-close aria-label="关闭车型参数">${close}</button></div><div class="spec-tabs" role="tablist" aria-label="参数分类">${specGroups.map((g, i) => `<button role="tab" id="tab-${g.id}" data-tab="${g.id}" aria-controls="panel-${g.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${g.label}</button>`).join('')}</div>${specGroups.map((g,i) => `<div role="tabpanel" id="panel-${g.id}" aria-labelledby="tab-${g.id}" class="spec-panel" ${i ? 'hidden' : ''}>${g.items.map(s => `<div class="spec-row"><span>${s.label}</span><strong>${s.value} <small>${s.unit}</small></strong></div>`).join('')}</div>`).join('')}<div class="spec-note"><p>${specificationNote}</p><p>${projectNote}</p>${sources.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label} ↗</a>`).join('')}</div></dialog>
  <dialog id="detail-dialog" aria-labelledby="detail-title"><button class="icon-button" data-close aria-label="关闭细节展示">${close}</button><img src="/images/craft-detail.webp" alt="双色油箱、羽冠徽标与 Espresso 皮革独座近景"/><div><p class="eyebrow">CRAFTED TO BE SEEN</p><h2 id="detail-title">每一处，都有来历。</h2><p>彩色羽冠徽记 · Espresso 皮革独座 · 双排缝线</p></div></dialog>
`;

let stage;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const toast = (message) => {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('visible');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('visible'), 3200);
};
const chapters = [...document.querySelectorAll('.chapter')];
let sectionIndex = 0;
let explore = false;
let spin = false;
let tour = { playing: false, paused: false, elapsed: 0, started: 0, last: 0 };
let scrolling = false;

function chapterScrollPosition(progress) {
  progress = Math.max(0, Math.min(chapters.length - 1, progress));
  const lower = Math.min(chapters.length - 1, Math.floor(progress));
  const upper = Math.min(chapters.length - 1, lower + 1);
  return chapters[lower].offsetTop + (chapters[upper].offsetTop - chapters[lower].offsetTop) * (progress - lower);
}

function scrollProgress() {
  for (let i = chapters.length - 1; i >= 0; i--) {
    if (scrollY >= chapters[i].offsetTop) {
      const next = chapters[i + 1];
      return next ? i + (scrollY - chapters[i].offsetTop) / (next.offsetTop - chapters[i].offsetTop) : i;
    }
  }
  return 0;
}

function updateScroll() {
  scrolling = false;
  const progress = scrollProgress();
  const index = Math.min(4, Math.round(progress));
  document.documentElement.style.setProperty('--scroll-progress', String(progress / 4));
  document.body.classList.toggle('past-hero', progress > .3);
  const atFooter = scrollY > document.querySelector('footer').offsetTop - innerHeight * .45;
  document.body.classList.toggle('at-footer', atFooter);
  document.querySelector('.viewer-controls').inert = atFooter;
  if (!explore) stage?.setProgress(progress);
  if (index !== sectionIndex) { sectionIndex = index; updateNav(); }
  chapters.forEach((el, i) => el.classList.toggle('in-view', Math.abs(progress - i) < .7));
}
function updateNav() {
  document.body.dataset.scene = ids[sectionIndex];
  document.querySelectorAll('[data-chapter]').forEach((el, i) => {
    if (i === sectionIndex) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
  });
  document.querySelectorAll('.main-nav a').forEach((el, i) => {
    el.classList.toggle('is-current', i === sectionIndex);
    if (i === sectionIndex) el.setAttribute('aria-current', 'location'); else el.removeAttribute('aria-current');
  });
}
window.addEventListener('scroll', () => { if (!scrolling) { scrolling = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
function gotoChapter(index) {
  stopTour(); setExplore(false);
  chapters[index].scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth' });
}
document.querySelectorAll('[data-chapter]').forEach(el => el.addEventListener('click', () => gotoChapter(Number(el.dataset.chapter))));
document.querySelectorAll('a[href^="#"]').forEach(el => el.addEventListener('click', e => {
  const index = ids.indexOf(el.hash.slice(1));
  if (index >= 0) { e.preventDefault(); gotoChapter(index); history.replaceState(null, '', el.hash); }
}));

function setExplore(enabled) {
  if (enabled && !stage?.ready) { toast('模型正在准备，请稍候'); return; }
  explore = enabled;
  stage?.setExplore(enabled);
  document.body.classList.toggle('is-exploring', enabled);
  document.querySelector('#story').inert = enabled;
  const button = document.querySelector('#explore-toggle');
  button.setAttribute('aria-pressed', String(enabled));
  button.querySelector('span').textContent = enabled ? '返回叙事' : '自由探索';
  document.querySelector('#viewer-hint').textContent = enabled ? '拖动旋转 · 双指或滚轮缩放' : '拖动，探索另一面';
  if (!enabled) { spin = false; setSpinUI(); stage?.setSpin(false); updateScroll(); }
}
function setSpinUI() {
  const el = document.querySelector('#spin-toggle');
  el.setAttribute('aria-pressed', String(spin));
  el.setAttribute('aria-label', spin ? '暂停自动环绕' : '开启自动环绕');
  el.innerHTML = spin ? '<span class="pause-symbol">Ⅱ</span>' : play;
}
document.querySelector('#explore-toggle').addEventListener('click', () => { stopTour(); setExplore(!explore); });
document.querySelector('#spin-toggle').addEventListener('click', () => {
  if (!stage?.ready) { toast('模型正在准备，请稍候'); return; }
  stopTour(); if (!explore) setExplore(true);
  spin = !spin; setSpinUI(); stage.setSpin(spin);
});
document.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => {
  if (!stage?.ready) { toast('模型正在准备，请稍候'); return; }
  stopTour(); setExplore(true); stage.focus(el.dataset.view);
}));
document.querySelector('#capture').addEventListener('click', async () => {
  if (!stage?.ready) { toast('模型准备完成后即可保存视角'); return; }
  try { await stage.capture(); toast('当前视角已保存'); } catch { toast('暂时无法保存，请重试'); }
});

function stopTour() {
  if (!tour.playing) return;
  tour.playing = false;
  document.querySelector('.tour-hud').hidden = true;
  document.body.classList.remove('tour-playing');
}
function startTour() {
  if (!stage?.ready) { toast('模型准备完成后即可开始展演'); return; }
  setExplore(false); tour = { playing: true, paused: false, elapsed: 0, last: performance.now() };
  scrollTo({ top: 0, behavior: 'instant' });
  document.querySelector('.tour-hud').hidden = false;
  document.querySelector('#tour-pause').textContent = '暂停';
  document.body.classList.add('tour-playing');
  requestAnimationFrame(tourFrame);
}
function tourFrame(now) {
  if (!tour.playing) return;
  if (!tour.paused && !document.hidden) tour.elapsed += Math.max(0, Math.min(now - tour.last, 100));
  tour.last = now;
  const t = Math.min(tour.elapsed / 30000, 1);
  // Hold each scene before the next smooth camera passage.
  const chapterT = t * 5;
  const base = Math.floor(chapterT);
  const blend = Math.max(0, Math.min(1, ((chapterT % 1) - .35) / .65));
  const smooth = blend * blend * (3 - 2 * blend);
  const position = Math.min(4, base + smooth);
  scrollTo({ top: chapterScrollPosition(position), behavior: 'instant' });
  document.querySelector('#tour-time').textContent = `00:${String(Math.floor(t * 30)).padStart(2, '0')} / 00:30`;
  document.querySelector('#tour-progress').style.width = `${t * 100}%`;
  if (t >= 1) { stopTour(); toast('传奇继续。拖动模型，发现你的视角。'); return; }
  requestAnimationFrame(tourFrame);
}
document.querySelector('#play-film').addEventListener('click', startTour);
document.querySelector('#tour-pause').addEventListener('click', e => {
  tour.paused = !tour.paused; e.currentTarget.textContent = tour.paused ? '继续' : '暂停';
});
document.querySelector('#tour-close').addEventListener('click', stopTour);
window.addEventListener('wheel', stopTour, { passive: true });
window.addEventListener('touchstart', e => { if (!e.target.closest('.tour-hud')) stopTour(); }, { passive: true });
window.addEventListener('keydown', e => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(e.key)) stopTour();
  if (e.key === 'Escape') { stopTour(); if (explore) setExplore(false); }
});

function openDialog(dialog) {
  stopTour(); dialog.showModal(); document.body.classList.add('dialog-open');
}
document.querySelectorAll('[data-specs]').forEach(el => el.addEventListener('click', () => openDialog(document.querySelector('#spec-dialog'))));
document.querySelector('#open-detail').addEventListener('click', () => openDialog(document.querySelector('#detail-dialog')));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
});
function selectTab(id) {
  document.querySelectorAll('[data-tab]').forEach(el => { const active = el.dataset.tab === id; el.setAttribute('aria-selected', String(active)); el.tabIndex = active ? 0 : -1; });
  document.querySelectorAll('.spec-panel').forEach(el => { el.hidden = el.id !== `panel-${id}`; });
}
document.querySelectorAll('[data-tab]').forEach((el, i, all) => {
  el.addEventListener('click', () => selectTab(el.dataset.tab));
  el.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight') next = (i + 1) % all.length;
    if (e.key === 'ArrowLeft') next = (i - 1 + all.length) % all.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = all.length - 1;
    if (next !== undefined) { e.preventDefault(); selectTab(all[next].dataset.tab); all[next].focus(); }
  });
});

updateScroll(); updateNav();
stage = createExperience(document.querySelector('#scene-canvas'), {
  onProgress: value => { document.querySelector('#load-percent').textContent = `${Math.round(value)}%`; document.documentElement.style.setProperty('--load', `${value}%`); },
  onReady: () => {
    document.body.classList.add('model-ready');
    document.querySelector('#load-label').textContent = '展厅已就绪';
    document.querySelector('#load-percent').textContent = '100%';
    setTimeout(() => document.querySelector('.load-status').classList.add('loaded'), 900);
    updateScroll();
    window.__experience = { ready: true, getMetrics: () => stage.getMetrics(), getState: () => ({ sectionIndex, explore, spin, tour: { ...tour } }) };
  },
  onInteract: () => { if (!explore) { stopTour(); setExplore(true); } },
  onError: message => {
    stopTour(); setExplore(false);
    document.body.classList.add('model-fallback');
    document.querySelector('#load-label').textContent = '当前设备使用静态展厅';
    document.querySelector('#load-percent').textContent = '';
    document.querySelector('.load-status').classList.add('is-fallback');
    document.querySelector('.viewer-controls').hidden = true;
    document.querySelector('#play-film').disabled = true;
    document.querySelector('#play-film').querySelector('span:last-child').innerHTML = '浏览车型故事<small>SCROLL TO EXPLORE</small>';
    document.querySelectorAll('[data-view]').forEach(el => el.hidden = true);
    console.warn('3D fallback:', message);
    window.__experience = { ready: false, fallback: true };
  },
});
