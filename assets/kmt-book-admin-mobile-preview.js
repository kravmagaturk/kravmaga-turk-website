/* KMT mobile admin preview: attribute-only responsive labels; does not
   change authentication, API, media sources or click event handlers. */
(function(){
 "use strict";
 const mark = () => {
   if(window.innerWidth>760)return;
   const buttons=Array.from(document.querySelectorAll('button,a')).filter(b=>/arşive\s+taşı/i.test((b.textContent||'').trim()));
   const cards=[];
   for(const btn of buttons){
     let node=btn.parentElement, card=null, steps=0;
     while(node&&node!==document.body&&steps++<9){
       const videos=node.querySelectorAll('video');
       const words=node.textContent||'';
       if(videos.length===1 && /ders\s*qr/i.test(words) && /arşive\s+taşı/i.test(words)){
         card=node;break;
       }
       node=node.parentElement;
     }
     if(!card||cards.includes(card))continue;
     cards.push(card);
     card.classList.add('kmt-mobile-admin-card');
     const video=card.querySelector('video');
     const actions=btn.parentElement;
     if(actions&&card.contains(actions))actions.classList.add('kmt-mobile-admin-actions');
     if(video){
       let current=video.parentElement, row=null;
       while(current&&current!==card){
         const children=Array.from(current.children);
         if(children.length>=2 && children.some(c=>c.contains(video)) &&
            children.some(c=>!c.contains(video) && (c.textContent||'').trim().length>=8)){
           row=current;break;
         }
         current=current.parentElement;
       }
       if(row)row.classList.add('kmt-mobile-admin-row');
       else if(video.parentElement)video.parentElement.classList.add('kmt-mobile-admin-media');
     }
   }
   const groups=new Map();
   cards.forEach(card=>{
     if(card.parentElement){
       const arr=groups.get(card.parentElement)||[];
       arr.push(card);
       groups.set(card.parentElement,arr);
     }
   });
   for(const [parent, children] of groups)if(children.length>=2)parent.classList.add('kmt-mobile-admin-list');
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mark,{once:true});
 else mark();
 const obs=new MutationObserver(()=>{if(window.innerWidth<=760)mark();});
 obs.observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener('resize',mark,{passive:true});
})();
