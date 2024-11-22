let intervalId3;
let intervalId4;
let time;
function run3() {
    time.s++;
    if (time.s == 60) {
        time.s = 0;
        time.m++;
    }
    if (time.m == 60) {
        time.m = 0;
        time.h++;
        time.addUp++;
        time.todayAddUp++;
    }
    console.log('时间', `${time.h > 9 ? time.h : '0' + time.h}:${time.m > 9 ? time.m : '0' + time.m}:${time.s > 9 ? time.s : '0' + time.s}`);
}
function run4() {
    if (time.m2 == 0 && time.s2 == 0) {
        updateDataToStoreWorker(time);
        time.m2 = 60;
        time.h2--;
        time.sumNeedTime--;
        time.todayNeedTime--;
    }
    if (time.s2 == 0) {
        updateDataToStoreWorker(time);
        time.s2 = 60;
        time.m2--;
    }
    time.s2--;
    // timeShows[1].textContent = `${time.h2 > 9 ? time.h2 : '0' + time.h2}:${time.m2 > 9 ? time.m2 : '0' + time.m2}:${time.s2 > 9 ? time.s2 : '0' + time.s2}`;
}
onmessage = (e) => {
    if (e.data[0] === 'start') {
        time = e.data[1];
        console.log(e.data);
        intervalId3 = setInterval(run3, 1000);
        intervalId4 = setInterval(run4, 1000);
        console.log('后台计时器执行');
    } else {
        clearInterval(intervalId3);
        clearInterval(intervalId4)
        console.log('后台计时器关闭');
        postMessage(time)
    }


};

let wkdb;
const DB_STORE_NAME_WK = 'skill';
const DB_NAME_WK = 'skillManage';
const DB_VERSION_WK = 4;
initalizeDBWorker();
function updateDataToStoreWorker(data) {
    let store = createStoreWorker('readwrite')
    data.dateTime = Date.now();
    store.put(data).onsuccess = (e) => {
        console.log('后台数据更新成功', e.target.result);
    };
}


function createStoreWorker(mode) {
    return mode ? wkdb.transaction(DB_STORE_NAME_WK, mode).objectStore(DB_STORE_NAME_WK) :
        wkdb.transaction(DB_STORE_NAME_WK).objectStore(DB_STORE_NAME_WK);
}

function initalizeDBWorker() {
    const request = indexedDB.open(DB_NAME_WK, DB_VERSION_WK);
    request.onsuccess = (e) => {
        console.log('数据库打开');
        wkdb = e.target.result;
    }
    request.onerror = (e) => {
        alert("请允许我的 web 应用使用 IndexedDB！");
    }
}