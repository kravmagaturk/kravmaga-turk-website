const allowed = new Set(["https://kravmaga.com.tr","https://www.kravmaga.com.tr"]);
const db = "https://kravmaga-diploma-default-rtdb.firebaseio.com";
let token = null, expires = 0;
function respond(body, status, origin) {
 const headers={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","x-robots-tag":"noindex","vary":"Origin"};
 if(allowed.has(origin)) Object.assign(headers,{"access-control-allow-origin":origin,"access-control-allow-methods":"POST,OPTIONS,GET","access-control-allow-headers":"content-type"});
 return new Response(status===204?null:JSON.stringify(body),{status,headers});
}
function b64(bytes) {
 let raw=""; for(const byte of bytes)raw+=String.fromCharCode(byte);
 return btoa(raw).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");
}
function der(pem, expectedEmail) {
 let raw=String(pem||"").trim();
 if(raw.startsWith("{")){
  let obj;
  try{obj=JSON.parse(raw)}catch{throw Error("Invalid service JSON")}
  if(obj.type!=="service_account"||obj.project_id!=="kravmaga-diploma"||obj.client_email!==expectedEmail)throw Error("Service identity mismatch");
  raw=String(obj.private_key||"");
 }else if(raw.startsWith('"')){
  try{const decoded=JSON.parse(raw);if(typeof decoded==="string")raw=decoded}catch{}
 }
 const b64=raw.replace(/\\n/g,"\n").replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g,"");
 if(!b64||!/^[A-Za-z0-9+/]+={0,2}$/.test(b64))throw Error("Invalid service private key format");
 return Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
}
async function getToken(env) {
 if(token&&Date.now()<expires)return token;
 const email=String(env.FIREBASE_SERVICE_ACCOUNT_EMAIL||"").trim(),pem=env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
 if(!email||!pem)throw Error("Service credentials missing");
 const key=await crypto.subtle.importKey("pkcs8",der(pem,email),{name:"RSASSA-PKCS1-v1_5",hash:"SHA-256"},false,["sign"]);
 const now=Math.floor(Date.now()/1000),e=new TextEncoder();
 const header=b64(e.encode(JSON.stringify({alg:"RS256",typ:"JWT"})));
 const claims=b64(e.encode(JSON.stringify({iss:email,scope:"https://www.googleapis.com/auth/firebase.database https://www.googleapis.com/auth/userinfo.email",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600})));
 const msg=header+"."+claims,sig=b64(new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5",key,e.encode(msg))));
 const body=new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:msg+"."+sig});
 const res=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:body.toString()});
 if(!res.ok)throw Error("OAuth token failed");
 const data=await res.json();if(!data.access_token)throw Error("OAuth token absent");
 token=data.access_token;expires=Date.now()+Math.max(60,Number(data.expires_in||3600)-120)*1000;
 return token;
}
function norm(v){return String(v||"").toLocaleLowerCase("tr-TR").replace(/ı/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c").trim()}
function rolesOf(r){
 let out=[];
 if(Array.isArray(r.publicRoles))out.push(...r.publicRoles);
 if(Array.isArray(r.roles))out.push(...r.roles);
 if(r.publicRole)out.push(r.publicRole);
 if(r.role)out.push(...String(r.role).split(/[,•]+/));
 if(r.instructor)out.push("instructor");
 if(r.assistant)out.push("asistan");
 if(r.representative)out.push("temsilci");
 if(r.expert)out.push("expert");
 return [...new Set(out.map(x=>{let v=norm(x);return {assistant:"asistan",representative:"temsilci",antrenor:"instructor"}[v]||v}).filter(Boolean))];
}
function statusOf(r){return ["pasif","faal olmayan","faal_olmayan","inactive"].includes(norm(r.status||"faal"))?"faal_olmayan":"faal"}
const fields=["name","fullName","adSoyad","publicRoles","roles","publicRole","role","instructor","assistant","representative","expert","status","levelText","level","levels","subLevel","webPortrait","webPortraitUrl","portrait","aiPortrait","photo","joinDate","academyJoinDate","akademiyeGirisTarihi","exitDate","academyExitDate","akademidenCikisTarihi","location","lokasyon","country","city","district"];
function limitedValue(k,v) {
 if(typeof v==="boolean")return v;
 if(Array.isArray(v))return v.slice(0,20).map(x=>String(x||"").slice(0,160));
 if(k==="photo"||k==="portrait"||k==="aiPortrait"||k==="webPortrait"||k==="webPortraitUrl"){
  const x=String(v||"");
  if(x.startsWith("https://")&&x.length<2048)return x;
  if(/^data:image\/(png|jpeg|webp);base64,/i.test(x)&&x.length<250000)return x;
  return "";
 }
 return String(v===null||v===undefined?"":v).slice(0,240);
}
function publicData(record){let r={};for(const k of fields)if(Object.prototype.hasOwnProperty.call(record,k))r[k]=limitedValue(k,record[k]);return r}
async function search(env,q,role,active){
 const access=await getToken(env);
 const res=await fetch(db+"/publicInstructors.json",{headers:{authorization:"Bearer "+access},cache:"no-store"});
 if(!res.ok)throw Error("Database unavailable");
 const data=await res.json(),matches=[];
 for(const [key,r] of Object.entries(data||{})){
  if(!r||typeof r!=="object")continue;
  if(!norm([r.name,r.fullName,r.adSoyad].filter(Boolean).join(" ")).includes(norm(q)))continue;
  if(role&&!rolesOf(r).includes(role))continue;
  if(active&&statusOf(r)!==active)continue;
  matches.push({key,data:publicData(r)});
 }
 matches.sort((a,b)=>norm(a.data.name||a.data.fullName).localeCompare(norm(b.data.name||b.data.fullName),"tr"));
 return matches.slice(0,20);
}
export default {
 async fetch(request,env){
  const origin=request.headers.get("Origin")||"",path=new URL(request.url).pathname;
  if(path==="/health"&&request.method==="GET")return respond({status:"ok"},200,origin);
  if(path==="/search"&&request.method==="OPTIONS")return respond({},allowed.has(origin)?204:403,origin);
  if(path!=="/search"||request.method!=="POST")return respond({error:"Adres bulunamadı."},404,origin);
  if(!allowed.has(origin))return respond({error:"Kaynak reddedildi."},403,"");
  if(!(request.headers.get("content-type")||"").includes("application/json"))return respond({error:"JSON bekleniyor."},415,origin);
  let payload;
  try{const raw=await request.text();if(raw.length>2048)return respond({error:"İstek çok büyük."},413,origin);payload=JSON.parse(raw)}
  catch{return respond({error:"Geçersiz sorgu."},400,origin)}
  const q=String(payload?.q||"").trim(),role=String(payload?.role||""),active=String(payload?.active||"");
  if(norm(q).length<3||q.length>80||!["","instructor","asistan","temsilci","expert"].includes(role)||!["","faal","faal_olmayan"].includes(active))return respond({error:"En az 3 karakter girin."},400,origin);
  if(!env.INSTRUCTOR_RATE_LIMITER||typeof env.INSTRUCTOR_RATE_LIMITER.limit!=="function")return respond({error:"Güvenlik denetimi hazır değil."},503,origin);
  try{
   const ip=request.headers.get("CF-Connecting-IP")||"unknown";
   const limit=await env.INSTRUCTOR_RATE_LIMITER.limit({key:"kmt-instructor:"+ip});
   if(!limit.success)return respond({error:"Çok sayıda sorgu. Biraz sonra tekrar deneyin."},429,origin);
   return respond({records:await search(env,q,role,active)},200,origin);
  }catch{return respond({error:"Sorgu hizmeti şu anda kullanılamıyor."},503,origin)}
 }
};
