// 离线页面和资源

self.addEventListener("fetch", (req)=>{
    caches.match(req.request).then(async (response) => {
    console.log('response',response);
        if (!response) {
        console.log('走查询');
            let resp = await fetch(req.request);
            let cache = await caches.open('pageV1');
            cache.put(req.request, resp.clone())
            return resp;
        } else {
        console.log('走缓存');
            return response;
        }
    }).catch((e)=>{
        console.log('请求失败!');
        
    })
})