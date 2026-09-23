(function(){
  function renderSharedFooter(){
    var holder=document.createElement('div');
    holder.innerHTML='<footer class="kmt-site-footer" data-component="shared-footer">'+
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
    var shared=holder.firstElementChild;
    var current=document.querySelector('footer');
    if(current){ current.replaceWith(shared); } else { document.body.appendChild(shared); }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',renderSharedFooter,{once:true});
  }else{
    renderSharedFooter();
  }
})();