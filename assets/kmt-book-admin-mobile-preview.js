/* KMT responsive BOOK ADMIN cards: does not modify video URLs or click handlers. */
(function () {
  'use strict';
  if (window.__KMT_BOOK_ADMIN_MOBILE_V3__) return;
  window.__KMT_BOOK_ADMIN_MOBILE_V3__ = true;

  function norm(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/ı/g, 'i').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function isLabel(node, term) { return norm(node.textContent).includes(term); }

  function identifyCard(button) {
    let node = button.parentElement;
    let hops = 0;
    while (node && node !== document.body && hops++ < 12) {
      const controls = Array.from(node.querySelectorAll('button,a,[role="button"]'));
      const archiveCount = controls.filter(x => isLabel(x, 'arsive tasi')).length;
      const qrCount = controls.filter(x => isLabel(x, 'ders qr')).length;
      const editCount = controls.filter(x => isLabel(x, 'duzenle')).length;
      const hasMedia = Boolean(node.querySelector('video,img,picture,canvas,[class*="thumbnail"],[class*="poster"],[class*="preview"]'));
      const hasTitle = Boolean(node.querySelector('h2,h3,h4,[class*="title"]'));
      if (archiveCount === 1 && (qrCount || editCount) && (hasMedia || hasTitle)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function markCard(card) {
    if (card.classList.contains('kmt-mobile-admin-card')) return;
    card.classList.add('kmt-mobile-admin-card');
    const media = card.querySelector('video,img,picture,canvas,[class*="thumbnail"],[class*="poster"],[class*="preview"]');
    if (media) {
      const m = media.matches('video,img,canvas') ? media : (media.querySelector('video,img,canvas') || media);
      m.classList.add('kmt-mobile-admin-thumb');
      if (m.parentElement && m.parentElement !== card) m.parentElement.classList.add('kmt-mobile-admin-media');
      let row = m.parentElement;
      while (row && row !== card) {
        const children = Array.from(row.children);
        const containsMedia = children.some(c => c.contains(m));
        const containsOtherText = children.some(c => !c.contains(m) && norm(c.textContent).length > 12);
        if (containsMedia && containsOtherText) {
          row.classList.add('kmt-mobile-admin-row');
          break;
        }
        row = row.parentElement;
      }
    }
    const all = Array.from(card.querySelectorAll('button,a,[role="button"]'));
    const archive = all.find(el => isLabel(el, 'arsive tasi'));
    const qr = all.find(el => isLabel(el, 'ders qr'));
    if (archive && qr) {
      let actions = archive.parentElement;
      for (let i = 0; actions && actions !== card && i < 5; i++,actions=actions.parentElement) {
        if (actions.contains(qr)) { actions.classList.add('kmt-mobile-admin-actions'); break; }
      }
    }
    if (card.parentElement) card.parentElement.classList.add('kmt-mobile-admin-list');
  }

  function apply() {
    if (window.innerWidth > 840) return;
    document.documentElement.classList.add('kmt-book-admin-mobile-on');
    document.body && document.body.classList.add('kmt-book-admin-mobile-on');
    Array.from(document.querySelectorAll('button,a,[role="button"]'))
      .filter(btn => isLabel(btn, 'arsive tasi'))
      .forEach(btn => { const card = identifyCard(btn); if (card) markCard(card); });
  }
  let pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; apply(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule, {once:true});
  else schedule();
  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {childList:true,subtree:true});
  window.addEventListener('resize', schedule, {passive:true});
})();
