let intervalId3;
let intervalId4;
let time;
function run3() {
    time.s++;
    time.addUp = Number(time.addUp) + 1000;
    time.todayAddUp = Number(time.todayAddUp) + 1000;
    if (time.s == 60) {
        time.s = 0;
        time.m++;
        updateDataToStoreWorker(time);
    }
    if (time.m == 60) {
        time.m = 0;
        time.h++;
        time.addUp++;
        time.todayAddUp++;
    }
}
function run4() {
    time.sumNeedTime = Number(time.sumNeedTime) - 1000;
    time.todayNeedTime = Number(time.todayNeedTime) - 1000;
    if (time.m2 == 0 && time.s2 == 0) {
        time.m2 = 60;
        time.h2--;
    }
    if (time.s2 == 0) {
        time.s2 = 60;
        time.m2--;
    }
    time.s2--;
}
onmessage = (e) => {
    console.log(e.data);

    switch (e.data[0]) {
        case 'start':
            time = e.data[1];
            intervalId3 = setInterval(run3, 1000);
            intervalId4 = setInterval(run4, 1000);
            console.log('后台计时器执行');
            break;
        case 'end':
            clearInterval(intervalId3);
            clearInterval(intervalId4)
            console.log('后台计时器关闭');
            postMessage(time)
            break;
        default:
            break;
    }
};

const DB_STORE_NAME_WK = 'skill';
const DB_NAME_WK = 'skillManage';
const DB_VERSION_WK = 4;

async function updateDataToStoreWorker(data) {
    let store = await createStoreWorker('readwrite')
    data.dateTime = Date.now();
    store.put(data).onsuccess = (e) => {
        console.log('后台数据更新成功', e.target.result);
    };
}


async function createStoreWorker(mode) {
    let wkdb = await initalizeDBWorker();
    return mode ? wkdb.transaction(DB_STORE_NAME_WK, mode).objectStore(DB_STORE_NAME_WK) :
        wkdb.transaction(DB_STORE_NAME_WK).objectStore(DB_STORE_NAME_WK);
}

async function initalizeDBWorker() {
    return new Promise((resolve) => {
        const request = indexedDB.open(DB_NAME_WK, DB_VERSION_WK);
        request.onerror = (e) => {
            alert("请允许我的 web 应用使用 IndexedDB！");
        }

        request.onsuccess = (e) => {
            console.log('数据库打开');
            let wkdb = e.target.result;
            resolve(wkdb);
        }
    })
}
