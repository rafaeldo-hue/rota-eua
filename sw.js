
const APP='rotaeua-app-v3', TILES='rotaeua-tiles-v1';
const SHELL=['./','index.html','manifest.json','icon-192.png',
 'leaflet.css','leaflet.js','MarkerCluster.css','MarkerCluster.Default.css','leaflet.markercluster.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(APP).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(u.hostname.endsWith('tile.openstreetmap.org')||u.hostname==='server.arcgisonline.com'){
    e.respondWith(caches.open(TILES).then(async c=>{const hit=await c.match(e.request); if(hit) return hit;
      try{const r=await fetch(e.request); if(r.ok) c.put(e.request,r.clone()); return r;}catch(err){return hit||Response.error();}}));
    return;
  }
  if(e.request.method!=='GET') return;
  if(u.origin!==location.origin && u.hostname!=='unpkg.com') return;
  const req = (e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html')) ? new Request(e.request.url,{cache:'no-cache'}) : e.request;
  e.respondWith(fetch(req).then(r=>{ if(r.ok && (u.origin===location.origin||u.hostname==='unpkg.com')){const cl=r.clone(); caches.open(APP).then(c=>c.put(e.request,cl));} return r;})
    .catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))));
});
