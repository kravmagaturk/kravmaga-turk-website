(function () {
  function injectSharedStyles() {
    if (document.getElementById("kmt-shared-layout-styles")) return;

    const style = document.createElement("style");
    style.id = "kmt-shared-layout-styles";
    style.textContent = `
      .transfer-nav{
        position:sticky!important;top:0;z-index:5000;background:#050607!important;
        border-bottom:1px solid #252525;color:#fff;font-family:Arial,Helvetica,sans-serif;
        box-shadow:0 5px 18px rgba(0,0,0,.22)
      }
      .transfer-nav-inner{
        max-width:1536px;margin:0 auto;min-height:72px;padding:0 24px;
        display:flex;align-items:center;gap:24px
      }
      .transfer-brand{
        color:#fff!important;text-decoration:none!important;font-weight:900;
        font-size:16px;letter-spacing:.06em;white-space:nowrap
      }
      .transfer-brand i{font-style:normal;color:#e30620}
      .transfer-links{
        margin-left:auto;display:flex;align-items:center;gap:8px
      }
      .transfer-item{position:relative}
      .transfer-item>a,.transfer-item>button{
        height:46px;display:flex;align-items:center;justify-content:center;padding:0 16px;
        border:1px solid rgba(255,255,255,.10);background:#111315;color:#f2f2f2!important;border-radius:8px;
        text-decoration:none!important;font:800 14px/1 Arial,Helvetica,sans-serif;letter-spacing:.05em;
        cursor:pointer;transition:background-color .12s ease,border-color .12s ease,color .12s ease
      }
      .transfer-item>a:hover,.transfer-item>button:hover,
      .transfer-item.open>button{
        background:#191c1f;border-color:rgba(227,6,32,.48);color:#fff!important
      }
      .transfer-item>a:focus-visible,.transfer-item>button:focus-visible{
        outline:2px solid #e30620;outline-offset:2px
      }

      .transfer-drop{
        display:none;position:absolute;top:46px;left:0;min-width:270px;
        background:#0b0c0e;border:1px solid #2a2d31;border-top:3px solid #e30620;
        box-shadow:0 14px 28px rgba(0,0,0,.42);border-radius:0 0 10px 10px;
        overflow:hidden;z-index:6000
      }
      .transfer-item.open>.transfer-drop{display:block}
      .transfer-drop a{
        display:block;padding:14px 16px;color:#ddd!important;text-decoration:none!important;
        font-size:13px;font-weight:700;border-bottom:1px solid #222;
        background:#0b0c0e;white-space:nowrap
      }
      .transfer-drop a:last-child{border-bottom:0}
      .transfer-drop a:hover{background:#17191c;color:#fff!important}

      .transfer-mobile{
        display:none;margin-left:auto;background:#111315;color:#fff;border:1px solid #3b3d42;
        border-radius:8px;padding:9px 12px;font-size:20px
      }

      .kmt-site-footer{
        width:100%;box-sizing:border-box;background:#070809!important;color:#aaa!important;
        border-top:3px solid #d60000;font-family:Arial,Helvetica,sans-serif
      }
      .kmt-footer-inner{
        max-width:1536px;margin:0 auto;padding:34px 5% 28px;
        display:flex;align-items:center;justify-content:space-between;gap:28px
      }
      .kmt-footer-brand strong{
        display:block;color:#fff!important;font-size:28px;font-weight:900;letter-spacing:1px;line-height:1.05
      }
      .kmt-footer-brand strong span{color:#d60000!important}
      .kmt-footer-brand small{
        display:block;margin-top:10px;color:#7f8690!important;font-size:12px;font-weight:700;letter-spacing:2px
      }
      .kmt-footer-info{
        display:flex;align-items:center;justify-content:flex-end;gap:28px;flex-wrap:wrap
      }
      .kmt-footer-info a,.kmt-footer-info span{
        color:#b8b8b8!important;text-decoration:none!important;font-size:13px;font-weight:800;
        letter-spacing:.04em;white-space:nowrap
      }
      .kmt-footer-info a:hover{color:#fff!important}
      .kmt-footer-copy{
        max-width:1536px;margin:0 auto;padding:18px 5% 22px;border-top:1px solid #1d1f22;
        color:#7f7f7f!important;font-size:12px;text-align:center;line-height:1.5
      }
      .kmt-footer-copy strong{color:#bdbdbd!important}


      /* ORTAK 19-48 LOGO FILIGRANI */
      .bc-watermark,
      .kmt-representative-page .watermark,
      .kmt-belgeler .water,
      #kmt-basin .basin-watermark{
        width:430px!important;height:430px!important;
        background:url("https://raw.githubusercontent.com/kravmagaturk/international-register/main/logo.png") center/contain no-repeat!important;
        opacity:.085!important;filter:grayscale(1)!important;
        color:transparent!important;font-size:0!important;letter-spacing:0!important;
        pointer-events:none!important
      }
      .bc-watermark>*,.kmt-representative-page .watermark>*,
      .kmt-belgeler .water>*,#kmt-basin .basin-watermark>*{
        display:none!important
      }

      .bc-video-watermark,.bc-section-year,.bc-dark-year{
        color:transparent!important;font-size:0!important;letter-spacing:0!important;
        width:250px!important;height:250px!important;
        background:url("https://raw.githubusercontent.com/kravmagaturk/international-register/main/logo.png") center/contain no-repeat!important;
        opacity:.055!important;filter:grayscale(1)!important;
        pointer-events:none!important
      }

      .kmt-representative-page .final::before,
      .kmt-belgeler .bottom::before,
      #kmt-basin .basin-media::before{
        content:""!important;
        width:320px!important;height:320px!important;
        background:url("https://raw.githubusercontent.com/kravmagaturk/international-register/main/logo.png") center/contain no-repeat!important;
        opacity:.045!important;filter:grayscale(1)!important;
        color:transparent!important;font-size:0!important;letter-spacing:0!important;
        pointer-events:none!important
      }

      @media(max-width:900px){
        .transfer-nav-inner{min-height:64px;padding:0 14px}
        .transfer-brand{font-size:14px}
        .transfer-mobile{display:block}
        .transfer-links{
          display:none;position:absolute;left:0;right:0;top:64px;background:#08090a;
          border-bottom:1px solid #26292d;padding:10px 14px 18px;flex-direction:column;gap:0;
          box-shadow:0 14px 24px rgba(0,0,0,.35)
        }
        .transfer-links.open{display:flex}
        .transfer-item{width:100%}
        .transfer-item>a,.transfer-item>button{
          width:100%;height:50px;justify-content:flex-start;border-radius:0;border:0;
          border-bottom:1px solid #202225;background:#08090a;padding:0 10px;font-size:14px
        }
        .transfer-drop{
          position:static;display:none;min-width:0;box-shadow:none;border:0;
          border-left:3px solid #d60000;border-radius:0;margin:0 0 8px 8px
        }
        .transfer-item.open>.transfer-drop{display:block}
        .transfer-drop a{white-space:normal}
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

  function closeAllMenus(exceptItem) {
    document.querySelectorAll(".transfer-item.open").forEach(function (item) {
      if (item !== exceptItem) {
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
        const isOpen = links.classList.toggle("open");
        mobileBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    document.querySelectorAll(".transfer-item > button").forEach(function (btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        const item = btn.parentElement;
        const shouldOpen = !item.classList.contains("open");

        closeAllMenus(item);
        item.classList.toggle("open", shouldOpen);
        btn.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      });
    });

    document.querySelectorAll(".transfer-drop").forEach(function (drop) {
      drop.addEventListener("click", function (event) {
        event.stopPropagation();
      });
      drop.addEventListener("mouseenter", function () {
        const item = drop.parentElement;
        if (item) item.classList.add("open");
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest(".transfer-nav")) {
        closeAllMenus();
        if (links && window.innerWidth <= 900) {
          links.classList.remove("open");
          if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
        }
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeAllMenus();
      }
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