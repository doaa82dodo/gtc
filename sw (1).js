const C='att4';
const FILES=['index.html','manifest.json','icon-192.png','icon-512.png'];
const U=f=>new URL(f,self.registration.scope).href;
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(C).then(c=>Promise.all(FILES.map(f=>
    fetch(U(f),{cache:'reload'}).then(r=>{if(r.ok&&!r.redirected)return c.put(U(f),r)}).catch(()=>{})
  ))));
  self.skipWaiting();
});
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())
));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  if(r.mode==='navigate'){
    e.respondWith(
      caches.match(U('index.html')).then(m=>{
        const n=fetch(r).then(x=>{if(x.ok&&!x.redirected){const y=x.clone();caches.open(C).then(c=>c.put(U('index.html'),y))}return x}).catch(()=>m);
        return m||n;
      })
    );
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(x=>{const y=x.clone();caches.open(C).then(c=>c.put(r,y));return x})));
});
