const CACHE_NAME = 'gelishi34-pwa-v1'; // 3:4 版（底板 3468×4624，4K 输出即 3468×4624）；缓存优先，每次改文件都必须改这个版本号
// v1: 新建。UI 外壳沿用「格丽诗方 v3.10」，版式常量按 3:4 效果图重新反算
//     （姓名改上下两行、照片窗口 3122×1898 居中、花纹框内腔 1440 限宽）。
//     ★ 缓存前缀特意用 'gelishi34-pwa-'：'gelishi-pwa-' 是方版、'nonbase64-pwa-' 是公司横版，
//       三套可能部署在同一个 GitHub Pages 源（同源共享 Cache Storage），前缀必须区分开。
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
      // 版本（方版 / 公司横版）的离线缓存
      keys.filter(k => k.indexOf('gelishi34-pwa-') === 0 && k !== CACHE_NAME)
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
