// 监听请求
self.addEventListener("fetch", (event) => {
    event.respondWith(
    caches.match(event.request).then(async (response) => {
        if (!response) {
            console.log('走查询',event.request);
            return fetch(event.request)
        } else {
            console.log('走缓存');
            return response;
        }
    })
    );
})
//监听sw安装
self.addEventListener("install", (event) => {
    console.log('清理缓存');
    self.skipWaiting();
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );

});
//将页面放进缓存
const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};
//监听激活
self.addEventListener('activate', event => {
    console.log('添加缓存');
    clients.claim();
    event.waitUntil(
        addResourcesToCache([
            "/",
            "index.html",
            "css/main.css",
            "js/main.js",
            "font/P3YMrUl62Myz.woff",
            "font/P3YMrUl62Myz.woff2",
            "images/add.svg",
            "images/background.jpg",
            "images/delete.svg",
            "images/increase.svg",
            "images/logo.svg",
            "images/menu.svg",
            "images/reduce.svg",
            "images/reset.svg",
            "images/return.svg",
            "images/start.svg",
            "images/stop.svg",
        ]),
    );
});