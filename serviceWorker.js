// 离线页面和资源


self.addEventListener("fetch", (event) => {
    event.respondWith(
    caches.match(event.request).then(async (response) => {
        if (!response) {
            console.log('走查询');
            addResourcesToCache([
                "/",
                "/index.html",
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
            ])
            // let resp = await fetch(event.request);
            // let cache = await caches.open('pageV1');
            // cache.put(event.request, resp.clone())
            // return resp;
        } else {
            console.log('走缓存');
            return response;
        }
    })
    );
})

// self.addEventListener("install", (event) => {
//     console.log('添加到缓存');
//     event.waitUntil(
//         addResourcesToCache([
//             "/",
//             "/index.html",
//             "css/main.css",
//             "js/main.js",
//             "font/P3YMrUl62Myz.woff",
//             "font/P3YMrUl62Myz.woff2",
//             "images/add.svg",
//             "images/background.jpg",
//             "images/delete.svg",
//             "images/increase.svg",
//             "images/logo.svg",
//             "images/menu.svg",
//             "images/reduce.svg",
//             "images/reset.svg",
//             "images/return.svg",
//             "images/start.svg",
//             "images/stop.svg",
//         ]),
//     );
// });
const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

self.addEventListener('activate', event => {
    console.log('激活方法');
    clients.claim()
    // event.waitUntil(
    //     caches.keys().then(cacheNames => {
    //         console.log(cacheNames);
            
    //         return Promise.all(
    //             cacheNames.map(cacheName => {
    //         console.log(cacheName);
    //                 return caches.delete(cacheName);
    //             })
    //         );
    //     })
    // );
});