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
  var assistantLang="tr", languagePacks=null, languageRequest=null;
  function languageUI(){return languagePacks&&languagePacks[assistantLang]?languagePacks[assistantLang].ui:null;}
  function translate(key, fallback){var u=languageUI();return u&&u[key]!==undefined?u[key]:fallback;}
  function speechTag(){return translate("tag","tr-TR");}
  function loadLanguages(){
    if(!languageRequest){
      languageRequest=fetch("/assets/kmt-assistant-languages.json?v=20261116-i18n1",{credentials:"omit"})
        .then(function(r){if(!r.ok)throw Error("Language pack unavailable");return r.json();})
        .then(function(x){languagePacks=x&&x.locales?x.locales:null;return languagePacks;})
        .catch(function(){return null;});
    }
    return languageRequest;
  }
  async function answerFromCards(q,forcedId){
    if(assistantLang==="tr"){
      if(forcedId){
        var alias={documents:"docs",address:"location",protection:"protect"};
        var ids=Array.isArray(forcedId)?forcedId:[forcedId];
        var picked=ids.map(function(id){return embedded.find(function(x){return x.id===(alias[id]||id);});}).filter(Boolean);
        if(picked.length)return {answer:picked.map(function(x){return x.a;}).join("\n\n"),url:picked[0].url};
      }
      return fallback(q);
    }
    if(!languagePacks)await loadLanguages();
    var data=languagePacks&&languagePacks[assistantLang];
    if(!data||!data.answers)return {answer:translate("loadFailed","Approved information is unavailable. Please contact the academy via WhatsApp."),url:"/iletisim"};
    var answers=data.answers,choices=Object.keys(answers).map(function(id){return {id:id,info:answers[id]};});
    if(forcedId){
      var ids2=Array.isArray(forcedId)?forcedId:[forcedId];
      var preselected=ids2.map(function(id){return choices.find(function(x){return x.id===id;});}).filter(Boolean);
      if(preselected.length)return {answer:preselected.map(function(x){return x.info.answer;}).join("\n\n").slice(0,3000),url:preselected[0].info.url};
    }
    var input=normalized(q);
    var scores=choices.map(function(x){
      var n=x.info.keywords.reduce(function(total,word){return total+(input.includes(normalized(word))?(word.length>=7?2:1):0);},0);
      return {info:x.info,n:n};
    }).sort(function(a,b){return b.n-a.n;});
    if(!scores.length||scores[0].n===0)return {answer:translate("unknown","Please contact us through WhatsApp for more information."),url:"/iletisim"};
    var combined=/\b(and|und|et|sowie|außerdem|ainsi)\b/i.test(input)||q.length>105;
    var selected=combined?scores.filter(function(x){return x.n>0;}).slice(0,3):scores.slice(0,1);
    return {answer:selected.map(function(x){return x.info.answer;}).join("\n\n").slice(0,3000),url:selected[0].info.url};
  }
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
    return '<img class="kmt-ai-figure" src="/assets/brand/favicon-96.png" width="96" height="96" alt="Krav Maga Türk 1948 logosu" decoding="async">';
  }
  function mount() {
    if(document.getElementById("kmt-ai-root"))return;
    var css=document.createElement("link");css.rel="stylesheet";css.href="/assets/kmt-assistant.css?v=20261116-i18n1";document.head.appendChild(css);
    var root=el("div");root.id="kmt-ai-root";
    var launch=el("button","kmt-ai-launch");launch.type="button";launch.setAttribute("aria-label","Krav Maga Türk Akıllı Asistanı aç");
    launch.innerHTML=icon()+'<span class="kmt-ai-launch-label">KMT Akıllı Asistan<span class="kmt-ai-launch-sub">Sorun, cevaplayalım</span></span>';
    var panel=el("section","kmt-ai-panel");panel.hidden=true;panel.setAttribute("role","dialog");panel.setAttribute("aria-label","KMT dijital danışman sohbeti");
    var head=el("div","kmt-ai-head");head.innerHTML=icon()+'<div class="kmt-ai-head-text"><strong class="kmt-ai-title">KMT Akıllı Asistan</strong><span class="kmt-ai-subtitle">Krav Maga Türk · Dijital danışman</span></div>';
    var languagePicker=el("select","kmt-ai-language");
    languagePicker.setAttribute("aria-label","Dil / Language / Sprache / Langue");
    [["tr","TR"],["en","EN"],["de","DE"],["fr","FR"]].forEach(function(pair){
      var option=el("option",null,pair[1]);option.value=pair[0];languagePicker.append(option);
    });
    head.appendChild(languagePicker);
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
      utter.lang=speechTag();utter.rate=.98;utter.pitch=1;utter.volume=1;
      var voices=window.speechSynthesis.getVoices();
      var selectedVoice=voices.find(function(x){return x.lang.toLowerCase()===speechTag().toLowerCase();})||voices.find(function(x){return x.lang.toLowerCase().startsWith(assistantLang);});
      if(selectedVoice)utter.voice=selectedVoice;
      window.speechSynthesis.speak(utter);
    }
    function bubble(role,s,url,source) {
      var node=el("div","kmt-ai-msg "+role,s);
      if(url && url.startsWith("/") && !url.startsWith("//")){
        var small=el("small"),a=el("a",null,translate("link","İlgili sayfayı aç"));a.href=url;small.append(a);node.append(small);
      }
      if(source){var src=el("small",null,source);node.append(src);}
      msgs.append(node);msgs.scrollTop=msgs.scrollHeight;
    }
    function toggle(open) {
      opened=open;panel.hidden=!open;launch.hidden=open;
      if(open){if(!msgs.childElementCount)bubble("bot",translate("greeting",GREETING));input.focus();}
      else{ if("speechSynthesis" in window)window.speechSynthesis.cancel();if(recognition){try{recognition.abort();}catch(_){}}launch.focus();}
    }
    function setVoice(on){
      voiceMode=on;textMode.setAttribute("aria-pressed",String(!on));speechMode.setAttribute("aria-pressed",String(on));
      status.textContent=on?translate("speechOn","Sesli yanıt açık"):translate("speechOff","Yazılı sohbet");
      if(on && !("speechSynthesis" in window)){status.textContent=translate("speechUnsupported","Sesli yanıt desteklenmiyor");voiceMode=false;speechMode.setAttribute("aria-pressed","false");textMode.setAttribute("aria-pressed","true");}
    }
    var trQuickIds=["group",["group","private"],"bio","documents","book"];
    function renderQuick(){
      chips.replaceChildren();
      var localized=translate("quick",null);
      var items=localized||quick.map(function(q,i){return [q[0],q[1],trQuickIds[i]];});
      items.forEach(function(item){
        var button=el("button",null,item[0]);button.type="button";
        button.addEventListener("click",function(){reply(item[1],item[2]);});
        chips.append(button);
      });
    }
    function refreshLanguage(){
      var ui=languageUI();
      languagePicker.value=assistantLang;panel.lang=speechTag();
      launch.setAttribute("aria-label",translate("open","KMT Akıllı Asistanı aç"));
      launch.querySelector(".kmt-ai-launch-sub").textContent=translate("sub","Sorun, cevaplayalım");
      head.querySelector(".kmt-ai-subtitle").textContent=translate("subtitle","Krav Maga Türk · Dijital danışman");
      close.setAttribute("aria-label",translate("close","Sohbeti kapat"));
      panel.setAttribute("aria-label",translate("dialog","KMT dijital danışman sohbeti"));
      input.placeholder=translate("placeholder","Sorunuzu yazın...");
      input.setAttribute("aria-label",translate("input","KMT asistana sorunuzu yazın"));
      mic.setAttribute("aria-label",translate("mic","Mikrofonla soru sor"));
      send.setAttribute("aria-label",translate("send","Mesajı gönder"));
      textMode.textContent=translate("text","Yazılı");
      speechMode.textContent=translate("voice","Sesli");
      status.textContent=voiceMode?translate("speechOn","Sesli yanıt açık"):translate("ready","Hazır · Site bilgileri");
      more.textContent=translate("contact","İletişim");
      note.firstChild.textContent=translate("notice","Sesli kullanım tarayıcı desteğine bağlıdır. Mikrofon yalnızca siz açarsanız çalışır. Kişisel bilgi paylaşmayın.");
      renderQuick();
    }
    languagePicker.addEventListener("change",async function(){
      if(busy){languagePicker.value=assistantLang;return;}
      languagePicker.disabled=true;
      assistantLang=languagePicker.value;
      if("speechSynthesis" in window)window.speechSynthesis.cancel();
      if(recognition){try{recognition.abort();}catch(_){}}
      if(assistantLang!=="tr")await loadLanguages();
      history=[];msgs.replaceChildren();input.value="";
      refreshLanguage();bubble("bot",translate("greeting",GREETING));
      languagePicker.disabled=false;input.focus();
    });
    async function reply(q,forcedId) {
      if(busy)return;busy=true;send.disabled=true;mic.disabled=true;languagePicker.disabled=true;
      bubble("user",q);history.push({role:"user",content:q});history=history.slice(-8);
      status.textContent=translate("working","Yanıt hazırlanıyor...");
      var found=null;var usedServer=false;
      try {
        var ctrl=new AbortController();var timeout=setTimeout(function(){ctrl.abort();},13000);
        try{
          var r=await fetch("/api/kmt-assistant",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,language:assistantLang,history:history.slice(0,-1)}),signal:ctrl.signal,credentials:"omit"});
          if(r.ok && (r.headers.get("content-type")||"").includes("application/json")){
            var data=await r.json();
            if(data && typeof data.answer==="string" && data.answer.trim().length){found={answer:data.answer.slice(0,1400),url:typeof data.url==="string"?data.url:null};usedServer=true;}
          }
        }finally{clearTimeout(timeout);}
      }catch(_){}
      if(!found)found=await answerFromCards(q,forcedId);
      bubble("bot",found.answer,found.url,usedServer?translate("aiSource","KMT dijital danışman"):translate("webSource","Akademinin yayımladığı bilgiler"));
      history.push({role:"assistant",content:found.answer});history=history.slice(-8);
      status.textContent=usedServer?translate("aiStatus","Yapay zekâ yanıtı"):translate("safeStatus","Site bilgileri · Güvenli yanıt");
      speak(found.answer);
      busy=false;send.disabled=false;mic.disabled=false;languagePicker.disabled=false;input.focus();
    }
    refreshLanguage();
    launch.addEventListener("click",function(){toggle(true);});
    close.addEventListener("click",function(){toggle(false);});
    textMode.addEventListener("click",function(){setVoice(false);if("speechSynthesis" in window)window.speechSynthesis.cancel();});
    speechMode.addEventListener("click",function(){setVoice(true);});
    compose.addEventListener("submit",function(e){e.preventDefault();var val=input.value.trim();if(!val)return;input.value="";reply(val);});
    mic.addEventListener("click",function(){
      if(!Recognition)return;
      try{
        if(recognition){recognition.abort();}
        recognition=new Recognition();recognition.lang=speechTag();recognition.interimResults=false;recognition.maxAlternatives=1;
        recognition.onresult=function(e){var heard=e.results[0][0].transcript.trim();if(heard){input.value=heard;reply(heard);}};
        recognition.onerror=function(){status.textContent=translate("micError","Mikrofon kullanılamadı; yazarak devam edebilirsiniz.");};
        recognition.onend=function(){mic.textContent="🎙";};
        mic.textContent="●";status.textContent=translate("listening","Dinliyorum...");recognition.start();
      }catch(_){status.textContent=translate("micError","Mikrofon kullanılamadı; yazarak devam edebilirsiniz.");}
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
