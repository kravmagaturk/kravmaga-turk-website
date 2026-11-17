/* KMT Akıllı Asistan — publicly verifiable site content, no personal/student/admin data.
   Routes only /api/kmt-assistant and /assets/kmt-assistant*. */
const BASE="https://kravmaga.com.tr";
const ORIGINS=new Set([BASE,"https://www.kravmaga.com.tr"]);
const ASSETS={
  "/assets/kmt-assistant.js":{
    sha:"a9563af2f3625e798402d5eb767d26ee5f2a0aba",
    mime:"application/javascript; charset=utf-8"
  },
  "/assets/kmt-assistant-knowledge.json":{
    sha:"265412271bd5bea9aed170caad3b1aada68baa4d",
    mime:"application/json; charset=utf-8"
  },
  "/assets/kmt-assistant-languages.json":{
    sha:"2b1c4247cfdff148ef98d673f488cb2fee026bdb",
    mime:"application/json; charset=utf-8"
  },
  "/assets/kmt-assistant.css":{
    sha:"344fe0bd1666de2ad2b6e92345a603237ebbca43",
    mime:"text/css; charset=utf-8"
  }
};
const ROUTES=[
  {path:"/krav-maga",topic:"group"},
  {path:"/ozel-dersler",topic:"private"},
  {path:"/cocuk-krav-maga",topic:"kids"},
  {path:"/bulent-cetin",topic:"bio"},
  {path:"/belgeler",topic:"documents"},
  {path:"/blog-krav-maga-turk-yeni-kitap",topic:"book"},
  {path:"/yakin-koruma",topic:"protection"},
  {path:"/ozel-guvenlik",topic:"protection"},
  {path:"/iletisim",topic:"address"},
  {path:"/blog",topic:"news"},
  {path:"/icerikler",topic:"system"},
  {path:"/online-akademi",topic:"online"},
  {path:"/krav-maga-kadikoy",topic:"system"},
  {path:"/temsilcilik",topic:"branches"},
  {path:"/egitmen-and-seviye-sorgu",topic:"instructor"},
  {path:"/kvkk-aydinlatma",topic:"privacy"}
];
const STOP=new Set("bir bu şu su ile ve veya için ne nedir nasıl hangi kaç kadar mı mi mu mü mıdır midir siz bana da de ile hakkında konusunda ilgili bilgi ver verir misiniz acaba ben biz bizim sizin onların var mı oluyor yapıyor yapılıyor ne zaman acaba hangi saat saatlerde kaçta için olur güncel şimdi bugün olan en bir".split(" "));
const KEYWORDS={
  attendance:["devam zorunlulugu","devam zorunlu","devamsizlik","devamsızlık","devam etmeli","devam etmek"],
  firstclass:["ilk ders","ne getirmeli","ne giy","spor ayakkab","spor kıyafet","deneme ders"],
  advanced:["advanced","ileri sınıf","üst seviye","üç ay sonra","ileriye geç"],
  capacity:["kontenjan","sınıf mevcudu","kaç kişi","kaç öğrenci","sınıflarda kaç","grupta kaç","katılımcı","kapasite","sınıf kaç kişilik"],
  group:["grup dersi","ders saati","program","salı","perşembe","telafi","haftada kaç gün","seans","ilk ders","devam zorunluluğu"],
  private:["özel ders","bire bir","birebir","private lesson","paket"],
  kids:["çocuk","kids","yaş","kaç yaş"],
  bio:["bülent çetin","kimdir","özgeçmiş","eğitmen geçmişi"],
  documents:["diploma","belge","sertifika","yetki","tescil"],
  book:["kitap","basım","baskı","ne zaman çıkacak"],
  levels:["seviye","p1","p2","p3","p4","p5","sınav"],
  system:["krav maga nedir","savunma","eğitim içeriği"],
  protection:["yakın koruma","özel güvenlik","koruma eğitimi"],
  address:["adres","konum","nerede","telefon","ulaşım","iletişim"],
  online:["online akademi","online eğitim","video paneli"],
  branches:["temsilcilik","temsilci","şube"],
  instructor:["eğitmen sorgu","eğitmen ara","sicil sorgu"],
  privacy:["kvkk","kişisel veri","aydınlatma"]
};
function norm(v){
 return String(v||"").toLocaleLowerCase("tr").normalize("NFD")
  .replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9\s]/g," ")
  .replace(/\s+/g," ").trim();
}
function tokens(v){
 return [...new Set(norm(v).split(" ").filter(t=>t.length>=3&&!STOP.has(t)))];
}
function stem(word){return word.length>=7?word.slice(0,6):word;}
function textScore(question,candidate){
 const words=tokens(candidate);const txt=new Set(words.map(stem));
 const query=tokens(question);
 let matched=0;
 for(const q of query){if(txt.has(stem(q)))matched++;}
 return {matched,score:query.length?matched/query.length:0};
}
function topicFor(question){
 const q=norm(question);
 let best={topic:null,score:0};
 for(const [topic,phrases] of Object.entries(KEYWORDS)){
  let n=0;
  for(const phrase of phrases){
   if(q.includes(norm(phrase)))n+=norm(phrase).includes(" ")?4:2;
  }
  if(n>best.score)best={topic,score:n};
 }
 return best.topic;
}
function decode(input){
 return String(input||"").replace(/&nbsp;|&#160;/gi," ")
   .replace(/&amp;/gi,"&").replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'")
   .replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
   .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
   .replace(/&#x([a-f0-9]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)));
}
function chunkText(html){
 const clean=String(html||"")
   .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
   .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
   .replace(/<header\b[^>]*>[\s\S]*?<\/header>/gi," ")
   .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi," ")
   .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi," ");
 const items=[],seen=new Set();
 const re=/<(h[1-4]|p|li|tr|td|div)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
 let match,n=0;
 while((match=re.exec(clean))!==null&&n++<2600){
  const tag=match[1].toLowerCase(),attrs=match[2]||"";
  if(tag==="div"&&!/(first-row|kmt-check|seans-|check|program-|data-row)/i.test(attrs))continue;
  const t=decode(match[3].replace(/<[^>]+>/g," ").replace(/\s+/g," ")).trim();
  if(t.length<20||t.length>750||seen.has(t))continue;
  seen.add(t);items.push(t);
  if(items.length>=300)break;
 }
 return items;
}
const LOCALIZED={
 tr:"Bu soruyla ilgili doğrulanmış bilgi sitede bulunamadı. Yanlış bilgi vermemek için akademiye danışabilirsiniz.",
 en:"I couldn't find verified information on the academy website. Please contact the academy for a reliable answer.",
 de:"Dazu habe ich auf der Website keine bestätigten Angaben gefunden. Bitte wenden Sie sich an die Akademie.",
 fr:"Je n'ai pas trouvé d'information vérifiée sur le site de l'académie. Veuillez contacter l'académie."
};
function json(data,status=200,origin=""){
 return new Response(JSON.stringify(data),{status,headers:{
  "content-type":"application/json; charset=utf-8",
  "cache-control":"private, no-store, max-age=0",
  "x-content-type-options":"nosniff",
  "access-control-allow-origin":ORIGINS.has(origin)?origin:BASE,
  "vary":"Origin","referrer-policy":"no-referrer"
 }});
}
async function getKnowledge(){
 const source=ASSETS["/assets/kmt-assistant-knowledge.json"];
 const u="https://raw.githubusercontent.com/kravmagaturk/kravmaga-turk-website/"+
  source.sha+"/assets/kmt-assistant-knowledge.json";
 const response=await fetch(u,{cf:{cacheEverything:true,cacheTtl:300},headers:{"accept":"application/json"}});
 if(!response.ok)throw Error("knowledge unavailable");
 return response.json();
}
function matchKnowledge(question,kb,lang){
 const q=norm(question),topic=topicFor(question);
 const entries=(kb.qa||[]).filter(x=>x&&x.id&&x.a&&x.url);
 const ranked=entries.map(item=>{
  const qScore=textScore(question,item.q);
  const keys=KEYWORDS[item.id]||[];
  const keyHit=keys.some(k=>q.includes(norm(k)));
  const relevant=qScore.matched>=1 || keyHit;
  return {item,score:relevant?(qScore.matched*2+qScore.score*3+(topic===item.id?8:0)+(keyHit?3:0)):0};
 }).sort((a,b)=>b.score-a.score);
 if(lang!=="tr")return null;
 if(!ranked.length||ranked[0].score<5)return null;
 const best=ranked[0].item;
 return {answer:best.a,url:best.url,source:"academy-knowledge"};
}
async function searchSite(question,lang){
 if(lang!=="tr")return null;
 const topic=topicFor(question);
 let paths=ROUTES;
 if(topic){
  const primary=ROUTES.filter(r=>r.topic===topic);
  const others=ROUTES.filter(r=>r.topic!==topic);
  paths=[...primary,...others.slice(0,9)];
 }else paths=ROUTES.slice(0,11);
 const candidates=[];
 const responses=await Promise.allSettled(paths.map(async route=>{
  const result=await fetch(BASE+route.path,{headers:{Accept:"text/html"},cf:{cacheEverything:true,cacheTtl:300}});
  if(!result.ok)return {route,items:[]};
  const html=(await result.text()).slice(0,450000);
  return {route,items:chunkText(html)};
 }));
 for(const p of responses){
  if(p.status!=="fulfilled")continue;
  for(const item of p.value.items){
   const m=textScore(question,item);
   if(m.matched<2&&!(topic===p.value.route.topic&&m.matched>=1))continue;
   const boost=topic===p.value.route.topic?1.8:0;
   const score=m.matched*2.3+m.score*6+boost-Math.max(0,item.length-350)/350;
   candidates.push({text:item,score,match:m.matched,route:p.value.route});
  }
 }
 candidates.sort((a,b)=>b.score-a.score);
 if(!candidates.length||candidates[0].score<4.5)return null;
 const best=candidates[0];
 return {answer:"Akademimizin yayımladığı bilgiye göre: "+best.text.slice(0,650),url:best.route.path,source:"academy-page"};
}
async function answer(request){
 const origin=request.headers.get("Origin")||"";
 if(!ORIGINS.has(origin))return json({error:"Yetkisiz kaynak."},403,origin);
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{
  "access-control-allow-origin":origin,"access-control-allow-methods":"POST, OPTIONS",
  "access-control-allow-headers":"Content-Type","vary":"Origin"
 }});
 if(request.method!=="POST")return json({error:"Method not allowed"},405,origin);
 if(Number(request.headers.get("content-length")||0)>10000)return json({error:"Soru çok uzun."},413,origin);
 let body;
 try {body=await request.json();}catch(_){return json({error:"Geçersiz veri."},400,origin);}
 const q=typeof body?.message==="string"?body.message.trim():"";
 const lang=["tr","en","de","fr"].includes(body?.language)?body.language:"tr";
 if(!q||q.length>500)return json({error:"Soru uzunluğu geçersiz."},400,origin);
 let result=null;
 try{
  const kb=await getKnowledge();
  result=matchKnowledge(q,kb,lang);
  if(!result)result=await searchSite(q,lang);
 }catch(e){console.log("KMT assistant site retrieval unavailable",String(e?.message||e));}
 return json(result||{answer:LOCALIZED[lang],url:"/iletisim",source:"no-verified-answer"},200,origin);
}
async function staticAsset(path,request){
 const asset=ASSETS[path];
 if(!asset)return new Response("Not found",{status:404});
 if(request.method!=="GET"&&request.method!=="HEAD")return new Response("Method not allowed",{status:405});
 const upstream="https://raw.githubusercontent.com/kravmagaturk/kravmaga-turk-website/"+
  asset.sha+path;
 let response;
 try{response=await fetch(upstream,{headers:{Accept:asset.mime},cf:{cacheEverything:true,cacheTtl:300}});}
 catch(_){return new Response("Asset unavailable",{status:502});}
 if(!response.ok)return new Response("Asset unavailable",{status:502});
 return new Response(request.method==="HEAD"?null:response.body,{status:200,headers:{
  "content-type":asset.mime,"cache-control":"public, max-age=60, must-revalidate",
  "x-content-type-options":"nosniff",
  "referrer-policy":"strict-origin-when-cross-origin"
 }});
}
export default {
 async fetch(request){
  const pathname=new URL(request.url).pathname;
  if(pathname==="/api/kmt-assistant")return answer(request);
  if(pathname.startsWith("/assets/kmt-assistant"))return staticAsset(pathname,request);
  return new Response("Not found",{status:404});
 }
};