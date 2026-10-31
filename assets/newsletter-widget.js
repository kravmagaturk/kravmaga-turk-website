(function () {
  'use strict';

  function addLoginNotice() {
    const academy = document.getElementById('loginBox');
    const book = !academy && document.querySelector('.auth-card');
    const host = academy || book;
    if (!host || host.querySelector('[data-kmt-newsletter]')) return;
    const source = academy ? 'akademi' : 'kitap';
    const section = document.createElement('section');
    section.className = 'kmt-login-newsletter';
    section.innerHTML = '<h3>Video ve haber bildirimleri</h3><p>Abone olursanız yeni eğitim videoları ve haberleri e-postayla alırsınız. Abonelik derslere giriş için zorunlu değildir.</p><form data-kmt-newsletter="' + source + '"><label>E-posta adresi <input type="email" name="email" autocomplete="email" maxlength="200" required></label><label class="kmt-newsletter-consent"><input type="checkbox" name="consent" required> E-posta duyurularını almak istiyorum.</label><button type="submit">Ücretsiz abone ol</button><p role="status" aria-live="polite"></p></form>';
    host.appendChild(section);
    if (!document.getElementById('kmt-login-newsletter-style')) {
      const style = document.createElement('style');
      style.id = 'kmt-login-newsletter-style';
      style.textContent = '.kmt-login-newsletter{margin-top:20px;padding:16px;border:1px solid #555;border-radius:10px;background:rgba(20,22,24,.72);color:#eee;font:14px/1.5 system-ui,sans-serif}.kmt-login-newsletter h3{margin:0 0 5px;font-size:17px;color:#fff}.kmt-login-newsletter p{margin:0 0 10px}.kmt-login-newsletter label{display:block;margin:8px 0}.kmt-login-newsletter input[type=email]{box-sizing:border-box;width:100%;padding:9px;border:1px solid #777;border-radius:5px;background:#fff;color:#111}.kmt-login-newsletter .kmt-newsletter-consent{display:flex;align-items:flex-start;gap:7px}.kmt-login-newsletter .kmt-newsletter-consent input{width:auto;margin:4px 0 0}.kmt-login-newsletter button{padding:10px 15px;border:0;border-radius:5px;background:#cb2034;color:#fff;font-weight:700;cursor:pointer}.kmt-login-newsletter [role=status]{margin:7px 0 0}';
      document.head.appendChild(style);
    }
  }

  function bindForms() {
    for (const form of document.querySelectorAll('form[data-kmt-newsletter]')) {
      if (form.dataset.bound === 'yes') continue;
      form.dataset.bound = 'yes';
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const button = form.querySelector('button[type=submit]');
        const status = form.querySelector('[role=status]');
        const email = form.elements.email.value.trim();
        button.disabled = true;
        status.textContent = 'Abonelik isteği gönderiliyor…';
        try {
          const response = await fetch('/online-akademi/abonelik', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email, consent: form.elements.consent.checked, source: form.dataset.kmtNewsletter })
          });
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'İstek tamamlanamadı.');
          status.textContent = result.message || 'Doğrulama e-postası gönderildi.';
          form.reset();
        } catch (error) {
          status.textContent = error.message || 'İstek tamamlanamadı.';
        } finally {
          button.disabled = false;
        }
      });
    }
  }

  function init() {
    addLoginNotice();
    bindForms();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
