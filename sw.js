const C='att1';
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html']))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||e.request.url.includes('script.google'))return;
  e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(C).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request)));
});
