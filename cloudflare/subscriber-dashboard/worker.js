const DASHBOARD_SOURCE = "https://raw.githubusercontent.com/kravmagaturk/kravmaga-turk-website/0feaad028a3d43120cd7e393b1ef12d0daf249ca/abone-yonetimi.html";
function secure(response) {
  const headers = new Headers(response.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("cache-control", "private, no-store, max-age=0");
  headers.set("x-robots-tag", "noindex, nofollow, noarchive, nosnippet");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
  headers.set("content-security-policy", "frame-ancestors 'none'");
  return new Response(response.body, {status:response.status,statusText:response.statusText,headers});
}
export default {
  async fetch(request) {
    const url=new URL(request.url);
    if(!["/abone-yonetimi","/abone-yonetimi/","/abone-yonetimi.html"].includes(url.pathname))
      return secure(new Response("Not found",{status:404}));
    if(request.method!=="GET" && request.method!=="HEAD")
      return secure(new Response("Method not allowed",{status:405,headers:{"allow":"GET, HEAD"}}));
    let upstream;
    try {upstream=await fetch(DASHBOARD_SOURCE,{headers:{"cache-control":"no-store"}});}
    catch (_) {return secure(new Response("Dashboard source not available",{status:502}));}
    if(!upstream.ok) return secure(new Response("Dashboard source not available",{status:502}));
    return secure(new Response(request.method==="HEAD"?null:await upstream.text(),{status:200}));
  }
};
