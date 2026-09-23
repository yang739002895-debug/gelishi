const CACHE_NAME = 'gelishi-pwa-v4'; // 方版（底板 2816×3072，4K 输出即 2816×3072）；缓存优先，每次改文件都必须改这个版本号
// v2: 修掉厅时段在「页面预览」里右移约 390 画布像素的 bug（measureText 单位混用，导出一直是正确的）
// v3: 版本标识改为 v3.10格丽诗版（显示版本按 +0.01 递增，与缓存号无关）
// v4: 选图 input 去掉 accept="image/*"，不限制文件类型（校验仍走 MIME 白名单）
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './back.png',
  './FZXiaoBiaoSong-B05S.woff2'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      // 只清自己这套缓存：caches.keys() 是整个源的，全清会顺手删掉同源其它
      // 版本（比如旧的 UI升级版）的离线缓存
      keys.filter(k => k.indexOf('gelishi-pwa-') === 0 && k !== CACHE_NAME)
          .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
