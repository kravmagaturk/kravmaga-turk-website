/* KMT Akıllı Asistan — hafif maskot / yazılı + isteğe bağlı sesli arayüz */
(function () {
  "use strict";
  if (document.getElementById("kmt-ai-root") || window.__KMT_ASSISTANT_LOADED__) return;
  window.__KMT_ASSISTANT_LOADED__ = true;

  var GREETING = "Merhaba, Krav Maga Türk Akademi'ye hoş geldiniz. Krav Maga Türk için size nasıl yardımcı olabilirim? Yazabilir veya sesli modu seçebilirsiniz.";
  var URL_BASE = "https://kravmaga.com.tr";
  var PHONE_URL = "https://wa.me/905321621821?text=" + encodeURIComponent("Merhaba, Krav Maga Türk eğitimleri hakkında bilgi almak istiyorum.");
  var quick = [
    ["Ders saatleri", "Grup dersleri hangi günler ve saat kaçta?"],
    ["Ücretler", "Grup ve özel ders ücretleri nedir?"],
    ["Bülent Çetin kimdir?", "Bülent Çetin kimdir ve eğitmenlik geçmişi nedir?"],
    ["Belgeler", "Bülent Çetin'in diplomaları ve yetkileri nelerdir?"],
    ["Yeni kitap", "Yeni Krav Maga Türk kitabı ne zaman çıkacak?"]
  ];
  var embedded = [
    {id:"group",terms:["grup","baslangic","seans","salı","sali","persembe","perşembe","telafi","saat"],a:"Başlangıç sınıfında Salı ve Perşembe saat 19.30'da grup dersleri var. Ayda 8 seans için sitede 4.000 TL + %20 KDV ücreti belirtiliyor. Pazar 12.00–13.00 telafi seansı bulunuyor. İlk deneme dersi ücretsiz. Güncel durumu akademiden teyit edebilirsiniz.",url:"/krav-maga"},
    {id:"private",terms:["ozel","özel","bire","paket"],a:"Bire bir özel dersler 60 dakikalık seanslar ve 10 derslik paketler şeklinde planlanır. Sitedeki ücret seans başına 4.000 TL + KDV'dir. Uygun saatler için WhatsApp'tan randevu alabilirsiniz.",url:"/ozel-dersler"},
    {id:"bio",terms:["bulent","bülent","cetin","çetin","kimdir","hayati","özgeçmiş"],a:"Bülent Çetin, Krav Maga Türk Akademi'nin kurucu eğitmenidir. Akademide yayımlanan özgeçmişinde spora 1979'da Tae Kwon Do ile başladığı, 2. Dan siyah kuşak ve resmî hakem olduğu, 1994'te CQC çalışmalarıyla tanıştığı ve 2016'da GIC-1/GIC-2 eğitmen eğitimlerini tamamladığı belirtilir. Bunlar akademinin yayımladığı özgeçmiş bilgileri olup bağımsız resmî doğrulama anlamına gelmez.",url:"/bulent-cetin"},
    {id:"docs",terms:["belge","diploma","sertifika","yetki","tescil","ruhsat","resmi"],a:"Akademinin Belgeler sayfasında Krav Maga eğitmenliği, Tae Kwon Do, hakemlik, güvenlik eğitimi ve marka tesciliyle ilgili bilgiler vardır. Önemli: Sitedeki 'ÖRNEKTİR' ibareli görseller orijinal diploma taraması değil, temsili çizimlerdir. Güncel resmî yetkileri ilgili kuruluşla veya akademiyle doğrudan teyit edin.",url:"/belgeler"},
    {id:"book",terms:["kitap","kitab","baski","baskı","yayin","yayın","cikacak","çıkacak","ne zaman","satış","satisa"],a:"Yeni Krav Maga Türk eğitim kitabının baskı hazırlıkları sürüyor; sitede kesin çıkış veya satış tarihi henüz açıklanmadı. Tarih ve temin bilgileri resmî duyuru sayfasında paylaşılacak. Bülent Çetin'in 2018 tarihli önceki Krav Maga kitabı da bu sayfada tanıtılıyor.",url:"/blog-krav-maga-turk-yeni-kitap"},
    {id:"kids",terms:["cocuk","çocuk","kids","yas","yaş"],a:"Kids Defense programı, sitede 9–12 yaş grubu için farkındalık, kişisel güvenlik, koordinasyon ve temel savunma eğitimi olarak tanıtılıyor. Güncel saat, katılım ve ücret için akademiyle görüşebilirsiniz.",url:"/cocuk-krav-maga"},
    {id:"protect",terms:["koruma","guvenlik","güvenlik","silah"],a:"Akademinin yakın koruma ve özel güvenlik eğitimi tanıtımları bulunuyor. Eğitim kapsamı ve fiyatı için kurumsal teklif alınmalıdır. Sitede silahlı eğitim verildiği varsayılmamalıdır.",url:"/yakin-koruma"},
    {id:"location",terms:["adres","konum","nerede","telefon","whatsapp","ulasim","ulaşım"],a:"Krav Maga Türk Akademi, Yoğurtçu Şükrü Sokak No:19, Osmanağa, Kadıköy / İstanbul adresinde. İşletme hattı: 0532 162 18 21.",url:"/iletisim"},
    {id:"levels",terms:["sinav","sınav","seviye","practitioner","antrenor","antrenör"],a:"Practitioner ve ileri seviye programlar hakkında bilgi sitemizde yer alıyor. Güncel sınav şartları, tarihler ve ücretler için eğitmenle görüşmenizi öneririm.",url:"/krav-maga"},
    {id:"system",terms:["krav","savunma","nasil","nasıl","tarihi","nedir","teknik"],a:"Krav Maga; tehditleri fark etme, güvenli mesafe, uzaklaşma ve gerektiğinde kontrollü kişisel savunmayı ele alan bir eğitim sistemidir. Teknikler eğitmen gözetiminde, güvenli çalışmayla öğretilir.",url:"/krav-maga"}
  ];

  function normalized(s) {
    return String(s || "").toLocaleLowerCase("tr-TR").normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "").replace(/ı/g, "i").replace(/[^a-z0-9\s]/g, " ");
  }
  function fallback(q) {
    var s=normalized(q);
    var score = function(entry) {
      return entry.terms.reduce(function(n,t){return n+(s.includes(normalized(t))?1:0);},0);
    };
    var ordered = embedded.map(function(x){return {e:x,n:score(x)};}).sort(function(a,b){return b.n-a.n;});
    var found=ordered[0];
    if(!found || found.n===0) return {answer:"Bu konuda onaylanmış ayrıntılı bilgi bulamadım. Yanlış bilgi vermemek için sizi akademimizin WhatsApp hattına yönlendirebilirim. Konuyu biraz daha ayrıntılı yazarsanız yardımcı olmaya çalışırım.",url:"/iletisim"};
    var compound = /\b(ve|ayrica|ayrıca|hem|bir de)\b/i.test(s) || s.length>95;
    var selected = compound ? ordered.filter(function(x){return x.n>0;}).slice(0,3) : [found];
    return {answer:selected.map(function(x){return x.e.a;}).join("\n\n").slice(0,2400),url:selected[0].e.url};
  }
  function el(tag, cls, text) {
    var n=document.createElement(tag);
    if(cls)n.className=cls;
    if(text!==undefined)n.textContent=text;
    return n;
  }
  function icon() {
    return '<svg class="kmt-ai-figure" viewBox="0 0 96 112" role="img" aria-label="Krav Maga savunma gardında KMT maskotu" focusable="false" xmlns="http://www.w3.org/2000/svg">'+
    '<defs><linearGradient id="kmt-ai-suit" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#272b30"/><stop offset="1" stop-color="#080b0e"/></linearGradient></defs>'+
    '<ellipse cx="48" cy="107" rx="25" ry="4" fill="#000" opacity=".25"/>'+
    '<g class="kmt-ai-character" stroke="#050608" stroke-linejoin="round" stroke-width="2.3">'+
    '<path d="M36 77l-3 29h14l3-25m10-4 6 29H52l-2-25" fill="#161a1d"/>'+
    '<path d="M30 105h18v5H27q-2-3 3-5m24 0h15q5 2 5 5H53z" fill="#090b0e"/>'+
    '<path d="M37 42q11-6 23 0l13 34-8 10-17-6-16 6-10-9z" fill="url(#kmt-ai-suit)"/>'+
    '<path d="M40 42l8 16 9-16" fill="none" stroke="#a32336" stroke-width="3"/>'+
    '<circle cx="56" cy="62" r="9" fill="#151719" stroke="#a9273b" stroke-width="2"/>'+
    '<path d="M50 64l4-5 3 4 4-5" fill="none" stroke="#df3a4e" stroke-width="2"/>'+
    '<path d="M37 45q-13 0-16 11l-7 19 10 5 10-17 10-5-6-11z" fill="#1a1c20"/>'+
    '<path d="M56 45q12-2 18 6l10 15-9 7-14-12-10-2z" fill="#1b1e22"/>'+
    '<path d="M14 69l10 5 13-23-8-8-8 5z" fill="#1a1d20"/>'+
    '<path d="M73 63l-10-5-10-11 7-9 13 10 10 16z" fill="#1a1d20"/>'+
    '<path d="M26 38q-4-5-8 0l-3 8 9 7 8-6zM54 30q-7-2-8 6l9 9 8-7z" fill="#36383e"/>'+
    '<path d="M36 25q-1-16 12-18 15 0 14 18l-4 12-10 8-10-9z" fill="#c58b70"/>'+
    '<path d="M36 23Q36 4 48 3Q63 4 63 23L59 13L40 16Z" fill="#b9886f"/><path d="M37 31Q43 34 47 35Q53 34 60 30L57 40Q51 47 47 45Q40 41 37 31Z" fill="#9b9a98" stroke="#49494b" stroke-width="1"/><path d="M45 34q3 2 7 0" fill="none" stroke="#554840" stroke-width="1.5"/>'+
    '<path d="M43 27h3m9-1h3" stroke="#28201c" stroke-linecap="round"/>'+
    '<path d="M45 34q4 3 9 0" fill="none" stroke="#754c40" stroke-width="1.4"/>'+
    '</g></svg>';
  }
  function mount() {
    if(document.getElementById("kmt-ai-root"))return;
    var css=document.createElement("link");css.rel="stylesheet";css.href="/assets/kmt-assistant.css?v=20261116";document.head.appendChild(css);
    var root=el("div");root.id="kmt-ai-root";
    var launch=el("button","kmt-ai-launch");launch.type="button";launch.setAttribute("aria-label","Krav Maga Türk Akıllı Asistanı aç");
    launch.innerHTML=icon()+'<span class="kmt-ai-launch-label">KMT Akıllı Asistan<span class="kmt-ai-launch-sub">Sorun, cevaplayalım</span></span>';
    var panel=el("section","kmt-ai-panel");panel.hidden=true;panel.setAttribute("role","dialog");panel.setAttribute("aria-label","KMT dijital danışman sohbeti");
    var head=el("div","kmt-ai-head");head.innerHTML=icon()+'<div class="kmt-ai-head-text"><strong class="kmt-ai-title">KMT Akıllı Asistan</strong><span class="kmt-ai-subtitle">Krav Maga Türk · Dijital danışman</span></div>';
    var close=el("button","kmt-ai-iconbtn","×");close.type="button";close.setAttribute("aria-label","Asistan penceresini kapat");head.appendChild(close);
    var msgs=el("div","kmt-ai-messages");msgs.setAttribute("role","log");msgs.setAttribute("aria-live","polite");msgs.setAttribute("aria-relevant","additions");
    var chips=el("div","kmt-ai-chips");
    var compose=el("form","kmt-ai-compose");
    var input=el("input");input.type="text";input.maxLength=500;input.placeholder="Sorunuzu yazın...";input.required=true;input.setAttribute("aria-label","KMT asistana sorunuzu yazın");
    var mic=el("button","kmt-ai-iconbtn","🎙");mic.type="button";mic.setAttribute("aria-label","Mikrofonla soru sor");mic.hidden=true;
    var send=el("button","kmt-ai-send","➤");send.type="submit";send.setAttribute("aria-label","Mesajı gönder");
    compose.append(input,mic,send);
    var toolbar=el("div","kmt-ai-toolbar"), modes=el("div","kmt-ai-modes");
    var textMode=el("button",null,"Yazılı"),speechMode=el("button",null,"Sesli");
    [textMode,speechMode].forEach(function(btn){btn.type="button";});
    textMode.setAttribute("aria-pressed","true");speechMode.setAttribute("aria-pressed","false");
    modes.append(textMode,speechMode);
    var status=el("span","kmt-ai-status","Hazır · Site bilgileri");
    toolbar.append(modes,status);
    var links=el("div","kmt-ai-linkbar");
    var wa=el("a",null,"WhatsApp");wa.href=PHONE_URL;wa.target="_blank";wa.rel="noopener noreferrer";
    var more=el("a",null,"İletişim");more.href="/iletisim";links.append(wa,more);
    var note=el("div","kmt-ai-note","Sesli kullanım tarayıcı desteğine bağlıdır. Mikrofon yalnızca siz açarsanız çalışır. Kişisel bilgi paylaşmayın.");
    var privacy=el("a",null," KVKK");privacy.href="/kvkk-aydinlatma";note.append(privacy);
    panel.append(head,msgs,chips,compose,toolbar,links,note);
    root.append(launch,panel);document.body.appendChild(root);
    var opened=false, voiceMode=false, busy=false, history=[];
    var recognition=null;var Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(Recognition){mic.hidden=false;}
    function speak(s) {
      if(!voiceMode || !("speechSynthesis" in window))return;
      window.speechSynthesis.cancel();
      var utter=new SpeechSynthesisUtterance(s);
      utter.lang="tr-TR";utter.rate=.98;utter.pitch=1;utter.volume=1;
      var voices=window.speechSynthesis.getVoices();
      var tr=voices.find(function(x){return x.lang.toLowerCase().startsWith("tr");});
      if(tr) utter.voice=tr;
      window.speechSynthesis.speak(utter);
    }
    function bubble(role,s,url,source) {
      var node=el("div","kmt-ai-msg "+role,s);
      if(url && url.startsWith("/") && !url.startsWith("//")){
        var small=el("small"),a=el("a",null,"İlgili sayfayı aç");a.href=url;small.append(a);node.append(small);
      }
      if(source){var src=el("small",null,source);node.append(src);}
      msgs.append(node);msgs.scrollTop=msgs.scrollHeight;
    }
    function toggle(open) {
      opened=open;panel.hidden=!open;launch.hidden=open;
      if(open){if(!msgs.childElementCount)bubble("bot",GREETING);input.focus();}
      else{ if("speechSynthesis" in window)window.speechSynthesis.cancel();if(recognition){try{recognition.abort();}catch(_){}}launch.focus();}
    }
    function setVoice(on){
      voiceMode=on;textMode.setAttribute("aria-pressed",String(!on));speechMode.setAttribute("aria-pressed",String(on));
      status.textContent=on?"Sesli yanıt açık":"Yazılı sohbet";
      if(on && !("speechSynthesis" in window)){status.textContent="Sesli yanıt bu tarayıcıda desteklenmiyor";voiceMode=false;speechMode.setAttribute("aria-pressed","false");textMode.setAttribute("aria-pressed","true");}
    }
    async function reply(q) {
      if(busy)return;busy=true;send.disabled=true;mic.disabled=true;
      bubble("user",q);history.push({role:"user",content:q});history=history.slice(-8);
      status.textContent="Yanıt hazırlanıyor...";
      var found=null;var usedServer=false;
      try {
        var ctrl=new AbortController();var timeout=setTimeout(function(){ctrl.abort();},13000);
        try{
          var r=await fetch("/api/kmt-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,history:history.slice(0,-1)}),signal:ctrl.signal,credentials:"omit"});
          if(r.ok && (r.headers.get("content-type")||"").includes("application/json")){
            var data=await r.json();
            if(data && typeof data.answer==="string" && data.answer.trim().length){found={answer:data.answer.slice(0,1400),url:typeof data.url==="string"?data.url:null};usedServer=true;}
          }
        }finally{clearTimeout(timeout);}
      }catch(_){}
      if(!found)found=fallback(q);
      bubble("bot",found.answer,found.url,usedServer?"KMT dijital danışman":"Yanıt: akademinin yayımladığı bilgiler");
      history.push({role:"assistant",content:found.answer});history=history.slice(-8);
      status.textContent=usedServer?"Yapay zekâ yanıtı":"Site bilgileri · Güvenli yanıt";
      speak(found.answer);
      busy=false;send.disabled=false;mic.disabled=false;input.focus();
    }
    quick.forEach(function(item){
      var btn=el("button",null,item[0]);btn.type="button";
      btn.addEventListener("click",function(){reply(item[1]);});
      chips.append(btn);
    });
    launch.addEventListener("click",function(){toggle(true);});
    close.addEventListener("click",function(){toggle(false);});
    textMode.addEventListener("click",function(){setVoice(false);if("speechSynthesis" in window)window.speechSynthesis.cancel();});
    speechMode.addEventListener("click",function(){setVoice(true);});
    compose.addEventListener("submit",function(e){e.preventDefault();var val=input.value.trim();if(!val)return;input.value="";reply(val);});
    mic.addEventListener("click",function(){
      if(!Recognition)return;
      try{
        if(recognition){recognition.abort();}
        recognition=new Recognition();recognition.lang="tr-TR";recognition.interimResults=false;recognition.maxAlternatives=1;
        recognition.onresult=function(e){var heard=e.results[0][0].transcript.trim();if(heard){input.value=heard;reply(heard);}};
        recognition.onerror=function(){status.textContent="Mikrofon kullanılamadı; yazarak devam edebilirsiniz.";};
        recognition.onend=function(){mic.textContent="🎙";};
        mic.textContent="●";status.textContent="Dinliyorum...";recognition.start();
      }catch(_){status.textContent="Mikrofon kullanılamadı; yazarak devam edebilirsiniz.";}
    });
    panel.addEventListener("keydown",function(e){if(e.key==="Escape"){e.preventDefault();toggle(false);}});
  }
  function load() {
    if("requestIdleCallback" in window)window.requestIdleCallback(mount,{timeout:2500});
    else setTimeout(mount,100);
  }
  if(document.readyState==="complete")load();
  else window.addEventListener("load",load,{once:true});
})();
