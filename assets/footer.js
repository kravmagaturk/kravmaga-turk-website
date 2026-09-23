(function () {
  function injectSharedStyles() {
    if (document.getElementById("kmt-shared-layout-styles")) return;

    const style = document.createElement("style");
    style.id = "kmt-shared-layout-styles";
    style.textContent = `
      :root{--kmt-red:#d60000;--kmt-text:#151515;--kmt-muted:#666;--kmt-line:#dedede;--kmt-soft:#f5f5f5}

      html,body{background:#fff!important;color:var(--kmt-text)!important}
      body{font-family:Arial,Helvetica,sans-serif!important}

      body>main,.page,.section,.content-block,.location-block,.registry,.band,
      .bc-intro,.bc-section,.bc-krav,.bc-people,.bc-links,.bc-dark,
      .kmt-egitim-sec,.kmt-reviews{
        background:#fff!important;color:var(--kmt-text)!important
      }

      body main h1,body main h2,body main h3,body main h4,
      body main p,body main li,body main span,body main strong,
      .page h1,.page h2,.page h3,.page p,
      .bc-intro h2,.bc-section h2,.bc-krav h2,.bc-people h2,.bc-links h2,
      .bc-intro p,.bc-krav p{
        color:var(--kmt-text)!important
      }

      body main .eyebrow,.bc-label,.kmt-egitim-baslik strong,
      .kmt-reviews-title span{color:var(--kmt-red)!important}

      .cards article,.mini-grid div,.contact-card,.schedule-panel,
      .bc-card,.bc-consult-card,.bc-org-card,.bc-person{
        background:var(--kmt-soft)!important;color:var(--kmt-text)!important;
        border-color:#ddd!important
      }

      .cards article p,.mini-grid span,.contact-card p,.schedule-panel small,
      .bc-card p,.bc-consult-card p,.bc-org-card p,.bc-person p{
        color:#555!important
      }

      .transfer-nav{
        position:sticky!important;top:0;z-index:5000;background:#fff!important;
        border-bottom:1px solid #ddd;color:#111;font-family:Arial,Helvetica,sans-serif;
        box-shadow:0 5px 18px rgba(0,0,0,.06)
      }

      .transfer-nav-inner{
        max-width:1536px;margin:0 auto;min-height:72px;padding:0 24px;
        display:flex;align-items:center;gap:24px
      }

      .transfer-brand{
        color:#111!important;text-decoration:none!important;font-weight:900;
        font-size:17px;letter-spacing:.055em;white-space:nowrap
      }

      .transfer-brand i{font-style:normal;color:var(--kmt-red)}

      .transfer-links{
        margin-left:auto;display:flex;align-items:center;gap:8px
      }

      .transfer-item{position:relative}

      .transfer-item>a,.transfer-item>button{
        height:44px;display:flex;align-items:center;justify-content:center;padding:0 17px;
        border:1px solid #d6d6d6;background:#fff;color:#171717!important;border-radius:8px;
        text-decoration:none!important;font:800 15px/1 Arial,Helvetica,sans-serif;
        letter-spacing:.035em;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.03);
        transition:background-color .12s ease,border-color .12s ease,color .12s ease
      }

      .transfer-item>a:hover,.transfer-item>button:hover,
      .transfer-item.open>button{
        background:#f7f7f7;border-color:#bbb;color:var(--kmt-red)!important
      }

      .transfer-item>a:focus-visible,.transfer-item>button:focus-visible{
        outline:2px solid var(--kmt-red);outline-offset:2px
      }

      .transfer-drop{
        display:none;position:absolute;top:50px;left:0;min-width:270px;
        background:#fff;border:1px solid #d9d9d9;border-top:3px solid var(--kmt-red);
        box-shadow:0 14px 28px rgba(0,0,0,.12);border-radius:0 0 10px 10px;overflow:hidden
      }

      .transfer-item.open>.transfer-drop{display:block}

      .transfer-drop a{
        display:block;padding:14px 16px;color:#222!important;text-decoration:none!important;
        font-size:14px;font-weight:700;border-bottom:1px solid #eee;
        transition:background-color .1s ease,color .1s ease
      }

      .transfer-drop a:last-child{border-bottom:0}
      .transfer-drop a:hover{background:#f6f6f6;color:var(--kmt-red)!important}

      .transfer-mobile{
        display:none;margin-left:auto;background:#fff;color:#111;border:1px solid #ccc;
        border-radius:8px;padding:9px 12px;font-size:20px
      }

      .kmt-site-footer{
        width:100%;box-sizing:border-box;background:#fff!important;color:#555!important;
        border-top:3px solid var(--kmt-red);font-family:Arial,Helvetica,sans-serif
      }

      .kmt-footer-inner{
        max-width:1536px;margin:0 auto;padding:34px 5% 28px;
        display:flex;align-items:center;justify-content:space-between;gap:28px
      }

      .kmt-footer-brand strong{
        display:block;color:#111!important;font-size:28px;font-weight:900;letter-spacing:1px;line-height:1.05
      }

      .kmt-footer-brand strong span{color:var(--kmt-red)!important}

      .kmt-footer-brand small{
        display:block;margin-top:10px;color:#777!important;font-size:12px;
        font-weight:700;letter-spacing:2px
      }

      .kmt-footer-info{
        display:flex;align-items:center;justify-content:flex-end;gap:28px;flex-wrap:wrap
      }

      .kmt-footer-info a,.kmt-footer-info span{
        color:#444!important;text-decoration:none!important;font-size:13px;font-weight:800;
        letter-spacing:.04em;white-space:nowrap
      }

      .kmt-footer-info a:hover{color:var(--kmt-red)!important}

      .kmt-footer-copy{
        max-width:1536px;margin:0 auto;padding:18px 5% 22px;border-top:1px solid #e3e3e3;
        color:#777!important;font-size:12px;text-align:center;line-height:1.5
      }

      .kmt-footer-copy strong{color:#444!important}

      @media(max-width:900px){
        .transfer-nav-inner{min-height:64px;padding:0 14px}
        .transfer-brand{font-size:15px}
        .transfer-mobile{display:block}
        .transfer-links{
          display:none;position:absolute;left:0;right:0;top:64px;background:#fff;
          border-bottom:1px solid #ddd;padding:10px 14px 18px;flex-direction:column;gap:0;
          box-shadow:0 14px 24px rgba(0,0,0,.10)
        }
        .transfer-links.open{display:flex}
        .transfer-item{width:100%}
        .transfer-item>a,.transfer-item>button{
          width:100%;height:50px;justify-content:flex-start;border-radius:0;border:0;
          border-bottom:1px solid #eee;background:#fff;padding:0 10px;font-size:15px;
          box-shadow:none
        }
        .transfer-drop{
          position:static;display:none;min-width:0;box-shadow:none;border:0;
          border-left:3px solid var(--kmt-red);border-radius:0;margin:0 0 8px 8px
        }
        .transfer-item.open>.transfer-drop{display:block}
        .kmt-footer-inner{display:block;padding:26px 18px 20px}
        .kmt-footer-brand strong{font-size:23px}
        .kmt-footer-brand small{font-size:11px;letter-spacing:1.4px}
        .kmt-footer-info{margin-top:18px;justify-content:flex-start;gap:14px 18px}
        .kmt-footer-copy{padding:14px 18px 18px;font-size:11px}
      }
    `;
    document.head.appendChild(style);
  }

  function buildHeader() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <header class="transfer-nav" data-component="shared-header">
        <div class="transfer-nav-inner">
          <a class="transfer-brand" href="index.html">KRAV MAGA <i>TÜRK</i></a>
          <button class="transfer-mobile" type="button" aria-label="Menüyü aç" aria-expanded="false">☰</button>
          <nav class="transfer-links" aria-label="Ana menü">
            <div class="transfer-item"><a href="index.html">ANA SAYFA</a></div>

            <div class="transfer-item">
              <button type="button" aria-expanded="false">HAKKIMIZDA ▾</button>
              <div class="transfer-drop">
                <a href="bulent-cetin.html">Bülent Çetin</a>
                <a href="temsilcilikler.html">Temsilcilikler</a>
                <a href="belgeler.html">Belgeler</a>
                <a href="legionnaire.html">Legionnaire</a>
                <a href="https://kravmaga.com.tr/egitmen-and-seviye-sorgu">Eğitmen &amp; Seviye Sorgu</a>
                <a href="basin.html">Basın</a>
                <a href="referanslar.html">Referanslar</a>
              </div>
            </div>

            <div class="transfer-item">
              <button type="button" aria-expanded="false">KRAV MAGA ▾</button>
              <div class="transfer-drop">
                <a href="krav-maga.html">Krav Maga</a>
                <a href="https://kravmagaturk.github.io/international-register/">Diploma Kayıt Sorgu</a>
                <a href="ozel-dersler.html">Özel Dersler</a>
                <a href="cocuk-krav-maga.html">Çocuk Dersleri</a>
                <a href="online-akademi.html">Eğitim Modül</a>
              </div>
            </div>

            <div class="transfer-item">
              <button type="button" aria-expanded="false">SECURITY ▾</button>
              <div class="transfer-drop">
                <a href="ozel-guvenlik.html">Özel Güvenlik</a>
                <a href="yakin-koruma.html">Yakın Koruma</a>
              </div>
            </div>

            <div class="transfer-item"><a href="https://kravmaga.com.tr/blog">BLOG</a></div>
            <div class="transfer-item"><a href="iletisim.html">İLETİŞİM</a></div>
          </nav>
        </div>
      </header>
    `;
    return wrap.firstElementChild;
  }

  function buildFooter() {
    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <footer class="kmt-site-footer" data-component="shared-footer">
        <div class="kmt-footer-inner">
          <div class="kmt-footer-brand">
            <strong>KRAV MAGA <span>TÜRK</span></strong>
            <small>GÜVENLİK DANIŞMANLIĞI · SELF DEFENSE ACADEMY</small>
          </div>
          <div class="kmt-footer-info">
            <a href="iletisim.html">İLETİŞİM</a>
            <span>KADIKÖY · İSTANBUL</span>
            <a href="https://www.instagram.com/kravmagaturk" target="_blank" rel="noopener">INSTAGRAM</a>
            <a href="https://www.youtube.com/@KravMagaTurk" target="_blank" rel="noopener">YOUTUBE</a>
          </div>
        </div>
        <div class="kmt-footer-copy">
          © COPYRIGHT 2026 TÜM HAKLARI SAKLIDIR.
          <strong>KRAV MAGA TÜRK GÜVENLİK DANIŞMANLIĞI</strong>
          ® TPE: 2007/49875
        </div>
      </footer>
    `;
    return wrap.firstElementChild;
  }

  function closeAllMenus(except) {
    document.querySelectorAll(".transfer-item.open").forEach(function (item) {
      if (item !== except) {
        item.classList.remove("open");
        const btn = item.querySelector(":scope > button");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  function bindMenu() {
    const mobileBtn = document.querySelector(".transfer-mobile");
    const links = document.querySelector(".transfer-links");

    if (mobileBtn && links) {
      mobileBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        const open = links.classList.toggle("open");
        mobileBtn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    document.querySelectorAll(".transfer-item > button").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.stopPropagation();
        const item = btn.parentElement;
        const willOpen = !item.classList.contains("open");
        closeAllMenus(item);
        item.classList.toggle("open", willOpen);
        btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
      });
    });

    document.querySelectorAll(".transfer-drop").forEach(function (drop) {
      drop.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    });

    document.addEventListener("click", function () {
      closeAllMenus();
      if (links && window.innerWidth <= 900) {
        links.classList.remove("open");
        if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", function () {
      closeAllMenus();
      if (links && window.innerWidth > 900) links.classList.remove("open");
    });
  }

  function renderSharedLayout() {
    injectSharedStyles();

    const currentHeader =
      document.querySelector("body > header") ||
      document.querySelector("header.transfer-nav") ||
      document.querySelector("header.top");

    const newHeader = buildHeader();

    if (currentHeader) {
      currentHeader.replaceWith(newHeader);
    } else {
      document.body.insertBefore(newHeader, document.body.firstChild);
    }

    const currentFooter = document.querySelector("footer");
    const newFooter = buildFooter();

    if (currentFooter) {
      currentFooter.replaceWith(newFooter);
    } else {
      document.body.appendChild(newFooter);
    }

    bindMenu();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSharedLayout, { once: true });
  } else {
    renderSharedLayout();
  }
})();