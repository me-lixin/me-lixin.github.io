// 离线页面和资源


self.addEventListener("fetch", (event) => {
    event.respondWith(
    caches.match(event.request).then(async (response) => {
        if (!response) {
            console.log('走查询');
            let resp = await fetch(event.request);
            let cache = await caches.open('pageV1');
            cache.put(event.request, resp.clone())
            return resp;
        } else {
            console.log('走缓存');
            return response;
        }
    })
    );

})

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "css/main.css",
            "js/main.js"
        ]),
    );
});
const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener('activate', event => {
    console.log('激活方法');
    event.waitUntil(clients.claim());

    // event.waitUntil(
    //     caches.keys().then(cacheNames => {
    //         return Promise.all(
    //             cacheNames.map(cacheName => {
    //                 // if (cacheWhitelist.indexOf(cacheName) !== -1) {
    //                     return caches.delete(cacheName);
    //                 // }
    //             })
    //         );
    //     })
    // );
    
});