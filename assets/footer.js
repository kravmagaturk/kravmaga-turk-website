(function(){
  function sharedHeader(){
    var wrap=document.createElement('div');
    wrap.innerHTML='<header class="transfer-nav" data-component="shared-header">'+
      '<div class="transfer-nav-inner">'+
        '<a class="transfer-brand" href="index.html">KRAV MAGA <i>TÜRK</i></a>'+
        '<button class="transfer-mobile" type="button" aria-label="Menüyü aç" aria-expanded="false">☰</button>'+
        '<nav class="transfer-links" aria-label="Ana menü">'+
          '<div class="transfer-item"><a href="index.html">ANA SAYFA</a></div>'+
          '<div class="transfer-item"><button type="button">HAKKIMIZDA ▾</button><div class="transfer-drop">'+
            '<a href="bulent-cetin.html">Bülent Çetin</a>'+
            '<a href="temsilcilikler.html">Temsilcilikler</a>'+
            '<a href="belgeler.html">Belgeler</a>'+
            '<a href="legionnaire.html">Legionnaire</a>'+
            '<a href="https://kravmaga.com.tr/egitmen-and-seviye-sorgu">Eğitmen &amp; Seviye Sorgu</a>'+
            '<a href="basin.html">Basın</a>'+
            '<a href="referanslar.html">Referanslar</a>'+
          '</div></div>'+
          '<div class="transfer-item"><button type="button">KRAV MAGA ▾</button><div class="transfer-drop">'+
            '<a href="krav-maga.html">Krav Maga</a>'+
            '<a href="https://kravmagaturk.github.io/international-register/">Diploma Kayıt Sorgu</a>'+
            '<a href="ozel-dersler.html">Özel dersler</a>'+
            '<a href="cocuk-krav-maga.html">Çocuk dersleri</a>'+
            '<a href="online-akademi.html">Eğitim Modül</a>'+
          '</div></div>'+
          '<div class="transfer-item"><button type="button">SECURITY ▾</button><div class="transfer-drop">'+
            '<a href="ozel-guvenlik.html">Özel Güvenlik</a>'+
            '<a href="yakin-koruma.html">Yakın Koruma</a>'+
          '</div></div>'+
          '<div class="transfer-item"><a href="https://kravmaga.com.tr/blog">BLOG</a></div>'+
          '<div class="transfer-item"><a href="iletisim.html">İLETİŞİM</a></div>'+
        '</nav>'+
      '</div>'+
    '</header>';
    return wrap.firstElementChild;
  }

  function sharedFooter(){
    var wrap=document.createElement('div');
    wrap.innerHTML='<footer class="kmt-site-footer" data-component="shared-footer">'+
      '<div class="kmt-footer-inner">'+
        '<div class="kmt-footer-brand"><strong>KRAV MAGA <span>TÜRK</span></strong><small>GÜVENLİK DANIŞMANLIĞI · SELF DEFENSE ACADEMY</small></div>'+
        '<div class="kmt-footer-info">'+
          '<a href="iletisim.html">İletişim</a>'+
          '<span>Kadıköy · İstanbul</span>'+
          '<a href="https://www.instagram.com/kravmagaturk" target="_blank" rel="noopener">Instagram</a>'+
          '<a href="https://www.youtube.com/@KravMagaTurk" target="_blank" rel="noopener">YouTube</a>'+
        '</div>'+
      '</div>'+
      '<div class="kmt-footer-copy">© Copyright 2026 Tüm Hakları Saklıdır. <strong>Krav Maga Türk Güvenlik Danışmanlığı</strong> ® TPE: 2007/49875</div>'+
    '</footer>';
    return wrap.firstElementChild;
  }

  function bindMenu(){
    var mb=document.querySelector('.transfer-mobile');
    var links=document.querySelector('.transfer-links');
    if(mb&&links){
      mb.addEventListener('click',function(){
        var open=links.classList.toggle('open');
        mb.setAttribute('aria-expanded',open?'true':'false');
      });
    }
    document.querySelectorAll('.transfer-item>button').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(window.innerWidth<=900) btn.parentElement.classList.toggle('open');
      });
    });
  }

  function renderSharedLayout(){
    var oldHeader=document.querySelector('body > header, body > .top');
    var header=sharedHeader();
    if(oldHeader){ oldHeader.replaceWith(header); } else { document.body.insertBefore(header,document.body.firstChild); }

    var oldFooter=document.querySelector('footer');
    var footer=sharedFooter();
    if(oldFooter){ oldFooter.replaceWith(footer); } else { document.body.appendChild(footer); }

    bindMenu();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',renderSharedLayout,{once:true});
  }else{
    renderSharedLayout();
  }
})();