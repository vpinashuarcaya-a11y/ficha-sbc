// Alerta SBC: guarda la app en el equipo para abrirla al instante y sin señal. Los datos van aparte (IndexedDB).
const V='fichasbc-v37';const ARCH=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(ARCH)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
// Primero la copia guardada (abre al instante aunque no haya señal); en segundo plano se baja la versión nueva para la próxima vez.
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
 const nav=e.request.mode==='navigate';const key=nav?'index.html':e.request;
 e.respondWith(caches.open(V).then(async c=>{
   const hit=await c.match(key,{ignoreSearch:true});
   const red=fetch(e.request).then(r=>{if(r&&r.ok)c.put(key,r.clone());return r}).catch(()=>null);
   if(hit){e.waitUntil(red);return hit}
   const r=await red;return r||(await c.match('index.html'))||new Response('Sin señal y sin copia guardada. Abre la app una vez con señal.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
 }))});
