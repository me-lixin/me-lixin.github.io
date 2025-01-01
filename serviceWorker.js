// 监听请求
const update = 'v3';
self.addEventListener("fetch", (event) => {
    let get = ()=>{
        const crPage = pages.filter((page)=>event.request.url === page.url)
        let myResponse = new Response(crPage[0].resp, {status:200,statusText:'OK'});
        return myResponse;
    }
    event.respondWith(get());
})
//监听sw安装
self.addEventListener("install", async (event) => {
    self.skipWaiting();
    event.waitUntil(
        addResourcesToDB(
            [
                    "/",
                    "/index.html",
                    "/css/main.css",
                    "/js/main.js",
                    "/font/P3YMrUl62Myz.woff",
                    "/font/P3YMrUl62Myz.woff2",
                    "/images/add.svg",
                    "/images/background.jpg",
                    "/images/delete.svg",
                    "/images/increase.svg",
                    "/images/logo.svg",
                    "/images/menu.svg",
                    "/images/reduce.svg",
                    "/images/reset.svg",
                    "/images/return.svg",
                    "/images/start.svg",
                    "/images/stop.svg",
                ]
        )
    );

});
//监听激活
self.addEventListener('activate', event => {
    // console.log('添加缓存');
    clients.claim();
    event.waitUntil(selectResources());

});
//把资源添加到IDB中
const addResourcesToDB = (resources) => {
    for (const url of resources) {
        fetch(url).then(resp=>resp.blob())
            .then(blob=>{
                let store;
                if (!store){
                    store = createStore(dbMode[0],'resource')
                }
                const result =store.put({'url':'http://localhost:8000'+url,'resp':blob})
            })
    }
};
//从IDB中获取资源
const selectResources = () => {
    const store = createStore(dbMode[0],'resource')
    const result = store.getAll();
    result.addEventListener('success', (e) => {
        pages = [...e.target.result]
        console.log('静态资源获取成功', e.target.result)
    })
};


// 数据库连接常量
dbName = 'page';
dbV = 2;
dbMode = ['readwrite','readonly'];
let db;
let pages =[];
init();

async function init() {
    db = await initalizeDB();
}
// 初始化
function initalizeDB(){
    return new Promise(resolve=>{

    // 打开数据库
    const request = indexedDB.open(this.dbName, this.dbV);
    // 打开成功赋值给全局db
    request.onsuccess = (e) => {
        resolve(e.target.result)
        console.log('SW数据库打开：')
    }
    // 打开错误
    request.onerror = (e) => {
        alert("请允许我的 web 应用使用 IndexedDB！");
    }
    // 首次构建
    request.onupgradeneeded = (e) => {
        e.target.result.deleteObjectStore('resource')
        e.target.result.createObjectStore('resource', { keyPath: 'url'})
    }
    })
}
function createStore(mode, storeName) {
    return db.transaction(storeName, mode).objectStore(storeName);
}