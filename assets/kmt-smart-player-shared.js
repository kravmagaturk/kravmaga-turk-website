/* KMT Shared Smart Video Panel v1.0.0
   Presentation only. Video source, permissions and server-side progress
   remain owned by the host (Book or Online Academy). No B2 proxying.
*/
(function () {
  'use strict';
  if (window.KMTSmartPlayer) return;

  var styleText = [
    '.kmtsp{font:14px/1.45 Arial,Helvetica,sans-serif;color:#f5f6f8;background:#171a20;border:1px solid #373e49;border-radius:12px;padding:13px;margin:12px 0;box-sizing:border-box}',
    '.kmtsp *{box-sizing:border-box}',
    '.kmtsp-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin:0 0 10px;flex-wrap:wrap}',
    '.kmtsp-head b{color:#ff6f7c;font-size:11px;letter-spacing:1.1px}',
    '.kmtsp-counter{color:#b7bbc4;font-size:12px}',
    '.kmtsp-actions{display:grid;grid-template-columns:1fr 1fr 1.2fr 1fr 1fr;gap:7px}',
    '.kmtsp button{cursor:pointer;border:1px solid #485261;background:#2b313c;border-radius:8px;color:#fff;min-height:40px;padding:7px;font:700 12px/1.2 Arial,Helvetica,sans-serif}',
    '.kmtsp button.primary{background:#d92b38;border-color:#d92b38}',
    '.kmtsp button:disabled{cursor:default;opacity:.45}',
    '.kmtsp button:focus-visible,.kmtsp input:focus-visible,.kmtsp select:focus-visible{outline:2px solid #fff;outline-offset:2px}',
    '.kmtsp-range{width:100%;display:block;margin:12px 0 3px;accent-color:#f04455}',
    '.kmtsp-range:disabled{opacity:.5}',
    '.kmtsp-times{display:flex;justify-content:space-between;font-size:12px;color:#c1c4cc}',
    '.kmtsp-tools{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:10px}',
    '.kmtsp-tools label{display:flex;gap:6px;align-items:center;color:#c5c9d2;font-size:12px}',
    '.kmtsp-tools select{background:#282e39;color:#fff;border:1px solid #485261;border-radius:8px;padding:9px;min-height:40px}',
    '.kmtsp-note{margin:9px 0 0;color:#b8bdc7;font-size:11px;line-height:1.45}',
    '.kmtsp-chapters{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0 0}',
    '.kmtsp-chapters button{min-height:35px;padding:6px 10px}',
    '.kmtsp-chapters button.active{background:#52242d;border-color:#ee4555}',
    '@media(max-width:650px){.kmtsp{padding:10px;border-radius:10px}.kmtsp-actions{grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.kmtsp-actions button{font-size:11px}.kmtsp-actions button:nth-child(4){grid-column:1/2}.kmtsp-actions button:nth-child(5){grid-column:2/4}}'
  ].join('\n');

  function ensureStyle() {
    if (document.getElementById('kmt-shared-smart-style')) return;
    var style = document.createElement('style');
    style.id = 'kmt-shared-smart-style';
    style.textContent = styleText;
    document.head.appendChild(style);
  }
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function secondsText(x) {
    if (!isFinite(x) || x < 0) x = 0;
    x = Math.floor(x);
    return Math.floor(x / 60) + ':' + String(x % 60).padStart(2, '0');
  }
  function safeGet(key) {
    try { return Number(localStorage.getItem(key)) || 0; } catch (e) { return 0; }
  }
  function safeSet(key, value) {
    try { localStorage.setItem(key, String(value)); } catch (e) {}
  }
  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  var instances = new WeakMap();
  function mount(video, options) {
    if (typeof video === 'string') video = document.querySelector(video);
    if (!video || video.tagName !== 'VIDEO') throw Error('KMTSmartPlayer: <video> is required');
    if (instances.has(video)) return instances.get(video).setLesson(options || {});
    ensureStyle();

    var opts = options || {}, language = 'tr', restored = false, lastSaved = -1;
    var panel = el('section', 'kmtsp');
    panel.setAttribute('aria-label', 'KMT Akıllı Video Paneli');
    var head = el('div', 'kmtsp-head');
    var heading = el('b', '', 'KMT AKILLI VİDEO PANELİ');
    var counter = el('span', 'kmtsp-counter', '');
    head.append(heading, counter);

    var actions = el('div', 'kmtsp-actions');
    function btn(name, action, primary) {
      var b = el('button', primary ? 'primary' : '', name);
      b.type = 'button';
      b.addEventListener('click', action);
      actions.appendChild(b);
      return b;
    }
    var prev = btn('‹ Önceki', function () { if (typeof opts.previous === 'function') opts.previous(); });
    var back = btn('↺ 10 sn', function () { if (isFinite(video.duration)) video.currentTime = Math.max(0, video.currentTime - 10); });
    var play = btn('▶ Oynat', function () { video.paused ? video.play().catch(function () {}) : video.pause(); }, true);
    var forward = btn('10 sn ↻', function () { if (isFinite(video.duration)) video.currentTime = Math.min(video.duration, video.currentTime + 10); });
    var next = btn('Sonraki ›', function () { if (typeof opts.next === 'function') opts.next(); });

    var seek = el('input', 'kmtsp-range');
    seek.type = 'range'; seek.min = '0'; seek.max = '0'; seek.step = '.1'; seek.value = '0'; seek.disabled = true;
    seek.setAttribute('aria-label', 'Video zamanı');
    seek.addEventListener('input', function () {
      if (isFinite(video.duration) && video.duration > 0) video.currentTime = Math.max(0, Math.min(video.duration, Number(seek.value)));
    });

    var times = el('div', 'kmtsp-times');
    var current = el('span', '', '0:00'), total = el('span', '', '0:00');
    times.append(current, total);

    var tools = el('div', 'kmtsp-tools');
    var speedLabel = el('label', '', 'Hız ');
    var speed = el('select');
    speed.setAttribute('aria-label', 'Video hızı');
    [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].forEach(function (n) {
      var o = el('option', '', String(n) + '×');
      o.value = String(n); if (n === 1) o.selected = true;
      speed.appendChild(o);
    });
    speed.addEventListener('change', function () { video.playbackRate = Number(speed.value) || 1; });
    speedLabel.appendChild(speed);
    var lang = el('button', '', 'TR / EN');
    lang.type = 'button';
    lang.addEventListener('click', function () { language = language === 'tr' ? 'en' : 'tr'; render(); });
    var full = el('button', '', '⛶ Tam ekran');
    full.type = 'button';
    full.addEventListener('click', function () {
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
      else if (video.parentElement && video.parentElement.requestFullscreen) video.parentElement.requestFullscreen().catch(function () {});
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    });
    tools.append(speedLabel, lang, full);

    var chapters = el('div', 'kmtsp-chapters');
    var note = el('p', 'kmtsp-note');
    panel.append(head, actions, seek, times, tools, chapters, note);
    var anchor = video.closest('.videoBox') || video.parentElement;
    anchor.insertAdjacentElement('afterend', panel);

    function storageKey() {
      if (!opts.userKey || !opts.lessonId) return null;
      return 'kmtSmartShared:v1:' + encodeURIComponent(String(opts.userKey)) + ':' + encodeURIComponent(String(opts.lessonId));
    }
    function renderChapters() {
      chapters.replaceChildren();
      if (!Array.isArray(opts.chapters)) return;
      opts.chapters.forEach(function (ch, i) {
        var t = Number(ch.start), label = ch.title;
        if (!isFinite(t) || t < 0 || typeof label !== 'string' || !label.trim()) return;
        var b = el('button', '', String(i + 1) + ' · ' + label);
        b.type = 'button'; b.dataset.time = String(t);
        b.addEventListener('click', function () { if (isFinite(video.duration)) { video.currentTime = Math.min(video.duration, t); video.play().catch(function () {}); } });
        chapters.appendChild(b);
      });
    }
    function restore() {
      if (restored || !isFinite(video.duration) || video.duration <= 3) return;
      restored = true;
      var candidate = Number(opts.resumeSec) || 0;
      if (!candidate && storageKey()) candidate = safeGet(storageKey());
      if (!opts.completed && candidate > 2 && candidate < video.duration - 2) video.currentTime = candidate;
      render();
    }
    function save(ended) {
      var key = storageKey();
      if (!key) return;
      if (ended) safeRemove(key);
      else if (isFinite(video.currentTime) && video.currentTime >= 0) safeSet(key, video.currentTime);
    }
    function onTime() {
      render();
      if (isFinite(video.currentTime) && Math.abs(video.currentTime - lastSaved) >= 1) {
        lastSaved = video.currentTime;
        save(false);
      }
    }
    function render() {
      var en = language === 'en', duration = Number(video.duration), t = Number(video.currentTime) || 0;
      var valid = isFinite(duration) && duration > 0;
      current.textContent = secondsText(t);
      total.textContent = valid ? secondsText(duration) : '0:00';
      seek.disabled = !valid;
      seek.max = valid ? String(duration) : '0';
      seek.value = valid ? String(Math.min(duration, t)) : '0';
      play.textContent = video.paused ? (en ? '▶ Play' : '▶ Oynat') : (en ? 'Ⅱ Pause' : 'Ⅱ Duraklat');
      prev.textContent = en ? '‹ Previous' : '‹ Önceki';
      next.textContent = en ? 'Next ›' : 'Sonraki ›';
      back.textContent = en ? '↺ 10 sec' : '↺ 10 sn';
      forward.textContent = en ? '10 sec ↻' : '10 sn ↻';
      speedLabel.firstChild.textContent = en ? 'Speed ' : 'Hız ';
      full.textContent = en ? '⛶ Fullscreen' : '⛶ Tam ekran';
      counter.textContent = String(opts.label || '');
      prev.disabled = typeof opts.previous !== 'function';
      next.disabled = typeof opts.next !== 'function';
      back.disabled = !valid || t < .2;
      forward.disabled = !valid || t >= duration - .2;
      note.textContent = en ? 'This panel does not change access rights or the original video audio/text.' :
        'Bu panel erişim izinlerini, videonun sesini veya yazılarını değiştirmez.';
      speed.value = String(video.playbackRate);
      Array.from(chapters.children).forEach(function (b, i, all) {
        var start = Number(b.dataset.time), end = i + 1 < all.length ? Number(all[i + 1].dataset.time) : Infinity;
        b.classList.toggle('active', t >= start && t < end);
      });
    }
    function onEnd() { save(true); render(); }
    video.addEventListener('loadedmetadata', restore);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('pause', function () { save(false); render(); });
    video.addEventListener('play', render);
    video.addEventListener('ended', onEnd);
    video.addEventListener('ratechange', render);
    video.addEventListener('durationchange', render);
    video.addEventListener('emptied', function () { restored = false; lastSaved = -1; render(); });

    var api = {
      element: panel,
      setLesson: function (nextOptions) {
        opts = nextOptions || {};
        restored = false; lastSaved = -1;
        renderChapters();
        render();
        if (video.readyState >= 1) restore();
        return api;
      },
      show: function (visible) { panel.hidden = !visible; return api; },
      getVideo: function () { return video; }
    };
    instances.set(video, api);
    api.setLesson(opts);
    return api;
  }
  window.KMTSmartPlayer = Object.freeze({ mount: mount, version: '1.0.0' });
})();
