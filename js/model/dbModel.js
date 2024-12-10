// 数据库类
class SkillDB {
    // 数据库连接常量
    dbName = 'skillManage';
    dbV = 12;
    dbStoreName = ['skill','skillLog'];
    dbMode = ['readwrite','readonly'];
    // 初始化
    initalizeDB(){
        return new Promise((resolve) => {
            // 打开数据库
            const request = indexedDB.open(this.dbName, this.dbV);
            // 打开成功赋值给全局db
            request.onsuccess = (e) => {
                resolve(e.target.result)
            }
            // 打开错误
            request.onerror = (e) => {
                alert("请允许我的 web 应用使用 IndexedDB！");
            }
            // 首次构建
            request.onupgradeneeded = (e) => {
                if (e.oldVersion > 0) {
                    e.target.result.deleteObjectStore(this.dbStoreName[0])
                    e.target.result.deleteObjectStore(this.dbStoreName[1])
                }
                let skillDB = e.target.result.createObjectStore(this.dbStoreName, { keyPath: 'id' })
                let logStore = e.target.result.createObjectStore(this.dbStoreName[1], { keyPath: 'id', autoIncrement: true })
                logStore.createIndex('dateTime', 'dateTime', { unique: true });
                skillDB.createIndex('dateTime', 'dateTime', { unique: true });
            }
        })
    }
    createStore(mode, storeName,db) {
        return mode ? db.transaction(storeName, mode).objectStore(storeName) :
            db.transaction(storeName).objectStore(storeName);
    }
}

export { SkillDB };