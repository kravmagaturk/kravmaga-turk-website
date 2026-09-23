(function(){
  function injectSharedStyles(){
    if(document.getElementById('kmt-shared-layout-styles')) return;
    var s=document.createElement('style');
    s.id='kmt-shared-layout-styles';
    s.textContent=`
    .transfer-nav{position:relative;z-index:1000;background:#050607;border-bottom:1px solid #252525;color:#fff;font-family:Arial,Helvetica,sans-serif}
    .transfer-nav-inner{max-width:1536px;margin:auto;min-height:72px;padding:0 28px;display:flex;align-items:center;gap:24px}
    .transfer-brand{font-weight:900;letter-spacing:.08em;white-space:nowrap;color:#fff!important;text-decoration:none!important;font-size:15px}.transfer-brand i{font-style:normal;color:#e30620}
    .transfer-links{margin-left:auto;display:flex;align-items:stretch;gap:7px}
    .transfer-item{position:relative}
    .transfer-item>a,.transfer-item>button{height:72px;display:flex;align-items:center;padding:0 15px;color:#f4f4f4!important;background:transparent;border:0;border-radius:6px;font:800 14px Arial,Helvetica,sans-serif;letter-spacing:.055em;cursor:pointer;text-decoration:none!important;transition:background-color .14s ease,color .14s ease,transform .14s ease}
    .transfer-item>a:hover,.transfer-item>button:hover{color:#fff!important;background:#17191b;transform:translateY(-1px)}
    .transfer-item>a:focus-visible,.transfer-item>button:focus-visible{outline:2px solid #d60000;outline-offset:-3px}
    .transfer-drop{display:none;position:absolute;top:72px;left:0;min-width:255px;background:#0b0c0e;border:1px solid #2a2c2f;border-top:3px solid #d60000;box-shadow:0 16px 30px rgba(0,0,0,.35);border-radius:0 0 8px 8px;overflow:hidden}
    .transfer-item:hover .transfer-drop,.transfer-item:focus-within .transfer-drop{display:block}
    .transfer-drop a{display:block;padding:14px 16px;border-bottom:1px solid #222;color:#ddd!important;font-size:13px;font-weight:700;text-decoration:none!important;transition:background-color .12s ease,color .12s ease}
    .transfer-drop a:hover{background:#17191b;color:#fff!important}
    .transfer-mobile{display:none;margin-left:auto;background:#111315;border:1px solid #3b3d40;border-radius:6px;color:#fff;padding:9px 12px;font-size:20px}
    .transfer-footer{width:100%;box-sizing:border-box;background:#070809;color:#9a9a9a;border-top:3px solid #d60000;padding:0!important;text-transform:none!important;font-family:Arial,Helvetica,sans-serif}
    .transfer-footer .transfer-footer-grid{max-width:1350px;margin:auto;padding:30px 5% 24px;display:grid;grid-template-columns:2fr 1fr 1fr;gap:34px}
    .transfer-footer strong{display:block;color:#fff;font-size:15px;letter-spacing:.06em;margin-bottom:8px}
    .transfer-footer p{margin:0;color:#8c8c8c;font-size:12px;line-height:1.6}
    .transfer-footer a{display:block;color:#b8b8b8!important;text-decoration:none!important;margin:8px 0;font-size:12px;font-weight:700}
    .transfer-footer a:hover{color:#fff!important}
    .transfer-copy{max-width:1350px;margin:auto;padding:15px 5% 19px;border-top:1px solid #222;color:#777;font-size:11px;text-align:center}
    @media(max-width:900px){
      .transfer-nav-inner{min-height:64px;padding:0 14px}.transfer-brand{font-size:14px}.transfer-mobile{display:block}
      .transfer-links{display:none;position:absolute;left:0;right:0;top:64px;background:#08090a;padding:8px 14px 16px;flex-direction:column;gap:0;border-bottom:1px solid #2a2c2f}
      .transfer-links.open{display:flex}.transfer-item>a,.transfer-item>button{width:100%;height:50px;padding:0 10px;border-radius:0;border-bottom:1px solid #222;font-size:14px}
      .transfer-item>a:hover,.transfer-item>button:hover{transform:none}.transfer-drop{position:static;display:none;box-shadow:none;border:0;border-left:2px solid #d60000;border-radius:0;margin:0 0 8px 8px}
      .transfer-item.open .transfer-drop{display:block}.transfer-item:hover .transfer-drop{display:none}.transfer-item.open:hover .transfer-drop{display:block}
      .transfer-footer .transfer-footer-grid{grid-template-columns:1fr;padding:25px 18px 20px;gap:20px}.transfer-copy{padding:14px 18px 18px}
    }
    `;
    document.head.appendChild(s);
  }

  function sharedHeader(){
    var wrap=document.createElement('div');
    wrap.innerHTML='<header class="transfer-nav" data-component="shared-header">'+
      '<div class="transfer-nav-inner">'+
        '<a class="transfer-brand" href="index.html">KRAV MAGA <i>TÜRK</i></a>'+
        '<button class="transfer-mobile" type="button" aria-label="Menüyü aç" aria-expanded="false">☰</button>'+
        '<nav class="transfer-links" aria-label="Ana menü">'+
          '<div class="transfer-item"><a href="index.html">ANA SAYFA</a></div>'+
          '<div class="transfer-item"><button type="button">HAKKIMIZDA ▾</button><div class="transfer-drop">'+
            '<a href="bulent-cetin.html">Bülent Çetin</a><a href="temsilcilikler.html">Temsilcilikler</a><a href="belgeler.html">Belgeler</a><a href="legionnaire.html">Legionnaire</a><a href="https://kravmaga.com.tr/egitmen-and-seviye-sorgu">Eğitmen &amp; Seviye Sorgu</a><a href="basin.html">Basın</a><a href="referanslar.html">Referanslar</a>'+
          '</div></div>'+
          '<div class="transfer-item"><button type="button">KRAV MAGA ▾</button><div class="transfer-drop">'+
            '<a href="krav-maga.html">Krav Maga</a><a href="https://kravmagaturk.github.io/international-register/">Diploma Kayıt Sorgu</a><a href="ozel-dersler.html">Özel Dersler</a><a href="cocuk-krav-maga.html">Çocuk Dersleri</a><a href="online-akademi.html">Eğitim Modül</a>'+
          '</div></div>'+
          '<div class="transfer-item"><button type="button">SECURITY ▾</button><div class="transfer-drop"><a href="ozel-guvenlik.html">Özel Güvenlik</a><a href="yakin-koruma.html">Yakın Koruma</a></div></div>'+
          '<div class="transfer-item"><a href="https://kravmaga.com.tr/blog">BLOG</a></div>'+
          '<div class="transfer-item"><a href="iletisim.html">İLETİŞİM</a></div>'+
        '</nav>'+
      '</div>'+
    '</header>';
    return wrap.firstElementChild;
  }

  function sharedFooter(){
    var wrap=document.createElement('div');
    wrap.innerHTML='<footer class="transfer-footer" data-component="shared-footer">'+
      '<div class="transfer-footer-grid">'+
        '<div><strong>KRAV MAGA TÜRK AKADEMİ</strong><p>Yakın savunma · kişisel güvenlik · İstanbul</p></div>'+
        '<div><strong>MENÜ</strong><a href="krav-maga.html">Krav Maga</a><a href="ozel-dersler.html">Özel Dersler</a><a href="cocuk-krav-maga.html">Çocuk Dersleri</a><a href="iletisim.html">İletişim</a></div>'+
        '<div><strong>SOSYAL</strong><a href="https://www.instagram.com/kravmagaturk" target="_blank" rel="noopener">Instagram</a><a href="https://www.youtube.com/@KravMagaTurk" target="_blank" rel="noopener">YouTube</a></div>'+
      '</div>'+
      '<div class="transfer-copy">© 2026 Krav Maga Türk · Kadıköy / İstanbul · ® TPE: 2007/49875</div>'+
    '</footer>';
    return wrap.firstElementChild;
  }

  function bindMenu(){
    var mb=document.querySelector('.transfer-mobile'), links=document.querySelector('.transfer-links');
    if(mb&&links) mb.addEventListener('click',function(){var o=links.classList.toggle('open');mb.setAttribute('aria-expanded',o?'true':'false')});
    document.querySelectorAll('.transfer-item>button').forEach(function(b){b.addEventListener('click',function(){if(window.innerWidth<=900)b.parentElement.classList.toggle('open')})});
  }

  function renderSharedLayout(){
    injectSharedStyles();
    var oldHeader=document.querySelector('body > header');
    var header=sharedHeader();
    if(oldHeader){oldHeader.replaceWith(header)}else{document.body.insertBefore(header,document.body.firstChild)}
    var oldFooter=document.querySelector('footer');
    var footer=sharedFooter();
    if(oldFooter){oldFooter.replaceWith(footer)}else{document.body.appendChild(footer)}
    bindMenu();
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',renderSharedLayout,{once:true})}else{renderSharedLayout()}
})();