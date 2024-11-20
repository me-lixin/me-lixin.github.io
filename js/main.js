const addSkillDoc = document.querySelector('.add-skill');
const asideDoc = document.querySelector('main aside');
const sectionDoc = document.querySelector('main section');
const skillInfoDoc = document.querySelector('.skill-info')
const backDoc = document.querySelector('.back')
const rangeDoc = document.querySelectorAll('.skill-form input[type="range"]')
const durationDoc = document.querySelectorAll('.duration')
const contentDoc = document.querySelector('.content')
const maskBtDoc = document.querySelector('.mask');
const maskDivDocs = document.querySelectorAll('.mask div');

const formDoc = document.getElementById('skillForm')

//indexDB常量
const DB_NAME = 'skillManage';
const DB_VERSION = 4;
const DB_STORE_NAME = 'skill';
const DB_MODE = 'readwrite';
//全局
let db;
let dataMap = new Map();
let currentPanel;


formDoc.addEventListener('reset', () => {
    durationDoc[0].textContent = '600';
    durationDoc[1].textContent = '9';
})
formDoc.reset();
initalizeDB();
contentShow();
// 添加技能按钮
addSkillDoc.addEventListener('click', () => {
    let hiddenNode = formDoc.lastChild
    if (hiddenNode.type === 'hidden') {
        hiddenNode.parentNode.removeChild(hiddenNode);
    }
    formDoc.reset();
    contentShow('skill');
})
// 返回按钮
backDoc.addEventListener('click', () => {
    if (window.innerWidth < 450) {
        sectionDoc.style.display = 'flex';
        asideDoc.style.display = 'none';
    } else {
        asideDoc.style.display = 'none';
    }

})
// 菜单按钮
const menuBtDoc = document.querySelector('.menu');
menuBtDoc.addEventListener('click', () => {
    contentShow('menu');
})
// 保存按钮
formDoc.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(formDoc)
    if (!formData.has('id')) {
        let id = getSkillId();
        formData.append('id', id)
    }
    updateDataToStore(Object.fromEntries(formData))
})
function initalizeDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onsuccess = (e) => {
        console.log('数据库打开');
        db = e.target.result;
        selectDataFromStore();

    }
    request.onerror = (e) => {
        alert("请允许我的 web 应用使用 IndexedDB！");
    }
    request.onupgradeneeded = (e) => {
        e.target.result.deleteObjectStore(DB_STORE_NAME)
        let skillDB = e.target.result.createObjectStore(DB_STORE_NAME, { keyPath: 'id' })
        e.target.result.deleteObjectStore('skillLog')
        let logStore = e.target.result.createObjectStore('skillLog', { keyPath: 'id', autoIncrement: true })
        logStore.createIndex('dateTime', 'dateTime', { unique: true });
        skillDB.createIndex('dateTime', 'dateTime', { unique: true });
        console.log('数据库构建');
    }

}
function createStore(mode) {
    return mode ? db.transaction(DB_STORE_NAME, mode).objectStore(DB_STORE_NAME) :
        db.transaction(DB_STORE_NAME).objectStore(DB_STORE_NAME);
}

function selectDataFromStore() {
    let store = createStore();
    const index = store.index('dateTime');
    index.openCursor(null, 'prev').onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
            dataToElement(e.target.result.value)
            cursor.continue();
        }
    }
    console.log('数据加载请求成功');

}
function updateDataToStore(data) {
    let store = createStore(DB_MODE)
    data.dateTime = Date.now();
    store.put(data).onsuccess = (e) => {
        console.log('数据更新成功', e.target.result);
        console.log('data', data);
        updatePanel(data);
    };
}
function dataToElement(item) {
    // for (const item of result) {
    dataMap.set(item.id, item);
    constructorPanel(item)
    // }
}

for (const range of rangeDoc) {
    range.addEventListener('input', () => {
        updateDuration(range)
    })
}
function updateDuration(range) {
    if (range.value >= 200) {
        durationDoc[0].textContent = range.value;
    } else {
        durationDoc[1].textContent = range.value;
    }
}

function updatePanel(data) {

    const div = document.getElementById(data.id) || document.createElement('div');

    fillPanel(div, data);
    sectionDoc.prepend(div);

}
// 动态面板
function constructorPanel(data) {
    const div = document.createElement('div');
    div.setAttribute('id', data.id)
    fillPanel(div, data);
    sectionDoc.prepend(div);
    // sectionDoc.appendChild(div);

    div.addEventListener('click', (e) => {
        if (e.target.type === 'button') {
            maskBtDoc.style.visibility = 'visible';
            currentPanel = dataMap.get(e.currentTarget.id)
            currentPanel.h = currentPanel.h || 0;
            currentPanel.m = currentPanel.m || 0;
            currentPanel.s = currentPanel.s || 0;
            currentPanel.h2 = currentPanel.h2 || currentPanel.todayTime;
            currentPanel.m2 = currentPanel.m2 || 0;
            currentPanel.s2 = currentPanel.s2 || 0;
            currentPanel.timerMode = currentPanel.timerMode || 'R';
            currentPanel.sumNeedTime = currentPanel.sumNeedTime || currentPanel.skillTime;
            currentPanel.todayNeedTime = currentPanel.todayNeedTime || currentPanel.todayTime;
            currentPanel.addUp = currentPanel.addUp || 1;
            currentPanel.todayAddUp = currentPanel.todayAddUp || 1;
            onOffDoc.textContent = '继续';
            timeShows[0].textContent = `${currentPanel.h > 9 ? currentPanel.h : '0' + currentPanel.h}:${currentPanel.m > 9 ? currentPanel.m : '0' + currentPanel.m}:${currentPanel.s > 9 ? currentPanel.s : '0' + currentPanel.s}`;
            timeShows[1].textContent = `${currentPanel.h2 > 9 ? currentPanel.h2 : '0' + currentPanel.h2}:${currentPanel.m2 > 9 ? currentPanel.m2 : '0' + currentPanel.m2}:${currentPanel.s2 > 9 ? currentPanel.s2 : '0' + currentPanel.s2}`;

            if (currentPanel.timerMode === 'R') {
                maskDivDocs[2].style.display = 'none';
                timerBtMode.textContent = '倒计时';

            } else {
                maskDivDocs[1].style.display = 'none';
                timerBtMode.textContent = '正计时';
            }
            console.log('currentPanel', currentPanel);
            onOff(onOffDoc);
        }
        fillForm(dataMap.get(e.currentTarget.id))
        contentShow('skill');

    })
}

function contentShow(type) {
    switch (type) {
        case 'skill':
            if (window.innerWidth < 450) {
                sectionDoc.style.display = 'none';
                contentDoc.style.display = 'none';
                asideDoc.style.display = 'flex';
                skillInfoDoc.style.display = 'block';
            } else {
                asideDoc.style.display = 'flex';
                contentDoc.style.display = 'none';
                skillInfoDoc.style.display = 'block';
            }
            break;
        case 'menu':
            if (window.innerWidth < 450) {
                sectionDoc.style.display = 'none';
                skillInfoDoc.style.display = 'none';
                asideDoc.style.display = 'flex';
                contentDoc.style.display = 'block';
            } else {
                asideDoc.style.display = 'flex';
                skillInfoDoc.style.display = 'none';
                contentDoc.style.display = 'block';
            }
            break;
        default:
            if (window.innerWidth < 450) {
                sectionDoc.style.display = 'flex';
                asideDoc.style.display = 'none';
            } else {
                asideDoc.style.display = 'flex';
                skillInfoDoc.style.display = 'none';
                contentDoc.style.display = 'block';
            }
    }
}
function fillPanel(div, data) {
    div.innerHTML = `
    <h2>${data.skillName}</h2>
    <p>你要用${data.skillTime}个小时来学会${data.skillName},要是学不会${data.skillName}你将生不如死!</p>
    <ul>
        <li>累计学习:${data.addUp || 0}小时</li>
        <li>今天计划学:${data.todayTime}小时</li>
        <li>今天已学习:${data.todayAddUp || 0}小时</li>
        <li>今天还需学:${data.todayNeedTime || data.todayTime}小时</li>
        <li>距离学会还剩:${data.sumNeedTime || data.skillTime}小时</li>
</ul>
<button id=${data.id} type="button" class="start-skill">开始计时</button>`
}
function fillForm(item) {
    for (const key in item) {
        let input = document.getElementById(key)
        if (!input) {
            input = document.createElement('input');
            input.id = key;
            input.type = 'hidden';
            input.name = key;
            input.value = item[key];
            formDoc.appendChild(input);
        } else if (input.type === 'range') {
            input.value = item[key];
            updateDuration(input)
        } else {
            input.value = item[key];
        }
    }
}

function getSkillId() {
    if (localStorage.getItem('skillId')) {
        let id = Number(localStorage.getItem('skillId')) + 1
        localStorage.setItem('skillId', id)
        return id;
    } else {
        localStorage.setItem('skillId', 1);
        return 1;
    }
}
// 计时
const onOffDoc = document.querySelector('.on-off');
const timeShows = document.querySelectorAll('.time-show');
let intervalId;
let intervalId2;
onOffDoc.addEventListener('click', (e) => {
    onOff(e.target);
})
function onOff(obj) {
    if (obj.textContent === '暂停') {
        obj.textContent = '继续';
        clearInterval(intervalId);
        clearInterval(intervalId2);

    } else {
        obj.textContent = '暂停';
        intervalId = setInterval(run, 1000);
        intervalId2 = setInterval(run2, 1000);
    }
}

function run() {
    currentPanel.s++;
    if (currentPanel.s == 60) {
        currentPanel.s = 0;
        currentPanel.m++;
        // const div = document.getElementById(currentPanel.id) || document.createElement('div');
        // fillPanel(div,currentPanel);
        // sectionDoc.prepend(div);
    }
    if (currentPanel.m == 60) {
        currentPanel.m = 0;
        currentPanel.h++;
        currentPanel.addUp++;
        currentPanel.todayAddUp++;
    }
    console.log(`${currentPanel.h > 9 ? currentPanel.h : '0' + currentPanel.h}:${currentPanel.m > 9 ? currentPanel.m : '0' + currentPanel.m}:${currentPanel.s > 9 ? currentPanel.s : '0' + currentPanel.s}`);
    
    timeShows[0].textContent = `${currentPanel.h > 9 ? currentPanel.h : '0' + currentPanel.h}:${currentPanel.m > 9 ? currentPanel.m : '0' + currentPanel.m}:${currentPanel.s > 9 ? currentPanel.s : '0' + currentPanel.s}`;

    // timeShows[0].textContent = `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
}

const timerBtMode = document.querySelector('.timer-mode');
timerBtMode.addEventListener('click', (e) => {
    if (e.target.textContent === '倒计时') {
        e.target.textContent = '正计时';
        currentPanel.timerMode = 'I'
        maskDivDocs[1].style.display = 'none';
        maskDivDocs[2].style.display = 'block';
    } else {
        e.target.textContent = '倒计时';
        currentPanel.timerMode = 'R'
        maskDivDocs[2].style.display = 'none';
        maskDivDocs[1].style.display = 'block';
    }
})
function run2() {
    if (currentPanel.m2 == 0 && currentPanel.s2 == 0) {
        currentPanel.m2 = 60;
        currentPanel.h2--;
        currentPanel.sumNeedTime--;
        currentPanel.todayNeedTime--;
    }
    if (currentPanel.s2 == 0) {
        currentPanel.s2 = 60;
        currentPanel.m2--;
    }
    currentPanel.s2--;
    console.log(`${currentPanel.h2 > 9 ? currentPanel.h2 : '0' + currentPanel.h2}:${currentPanel.m2 > 9 ? currentPanel.m2 : '0' + currentPanel.m2}:${currentPanel.s2 > 9 ? currentPanel.s2 : '0' + currentPanel.s2}`);
    
    // timeShows[1].textContent = `${h2 > 9 ? h2 : '0' + h2}:${m2 > 9 ? m2 : '0' + m2}:${s2 > 9 ? s2 : '0' + s2}`;
    timeShows[1].textContent = `${currentPanel.h2 > 9 ? currentPanel.h2 : '0' + currentPanel.h2}:${currentPanel.m2 > 9 ? currentPanel.m2 : '0' + currentPanel.m2}:${currentPanel.s2 > 9 ? currentPanel.s2 : '0' + currentPanel.s2}`;

}

maskBtDoc.addEventListener('keydown', (e) => {
    console.log('key', Date.now());
    if (e.code === 'Escape') {
        maskBtDoc.style.visibility = 'hidden';
        const div = document.getElementById(currentPanel.id);
        fillPanel(div, currentPanel);
        sectionDoc.prepend(div);
        clearInterval(intervalId);
        clearInterval(intervalId2);
    } else if (e.code === 'Space') {
        onOff(onOffDoc);
    }

})

// 后台运行逻辑
const worke = new Worker('js/timer.js')
document.addEventListener('visibilitychange', () => {
    if (document.hidden && maskBtDoc.style.visibility === 'visible') {
        console.log('页面隐藏，降低任务频率');
        worke.postMessage(['start', currentPanel])
        // 调整任务逻辑
    } else if(!document.hidden && maskBtDoc.style.visibility === 'visible'){

        worke.postMessage('end')
        worke.onmessage = (e) => {
            console.log('时间', e.data);
        }
        console.log('页面激活，恢复任务频率');

        // 恢复任务逻辑
    }
});
