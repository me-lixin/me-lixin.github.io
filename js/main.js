const addSkillDoc = document.querySelector('.add-skill');
const asideDoc = document.querySelector('main aside');
const sectionDoc = document.querySelector('main section');
const skillInfoDoc = document.querySelector('.skill-info')
const backDoc = document.querySelector('.back')
const rangeDoc = document.querySelectorAll('.skill-form input[type="range"]')
const durationDoc = document.querySelectorAll('.duration')
const contentDoc = document.querySelector('.content')
const contentDivDoc = document.querySelectorAll('.content div')
const logInfoDoc = document.querySelector('.log-info');
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
        selectSkillLogList();


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
function createStore(mode, storeName) {
    return mode ? db.transaction(storeName, mode).objectStore(storeName) :
        db.transaction(storeName).objectStore(storeName);
}

function selectDataFromStore() {
    let store = createStore('readonly', DB_STORE_NAME);
    const index = store.index('dateTime');
    index.openCursor().onsuccess = (e) => {
        const cursor = e.target.result
        if (cursor) {
            dataToElement(e.target.result.value)
            cursor.continue();
        }
    }
    console.log('数据加载请求成功');
}
function updateDataToStore(data) {
    let store = createStore(DB_MODE, DB_STORE_NAME)
    data.dateTime = Date.now();
    store.put(data).onsuccess = (e) => {
        console.log('数据更新成功', e.target.result);
        console.log('data', data);
        updatePanel(data);
    };
}
// const now = new Date(item.startDateTime);
// const day = new Date(now.getFullYear(),now.getMonth()+1,0);

// function selectSkillLogToStatistics1(range) {
//     const store = createStore('readonly', 'skillLog');
//     const index = store.index('dateTime');
//     let range =IDBKeyRange.Bound(Date.now());;
//     if (range==='year') {
//         range = IDBKeyRange.Bound(Date.now());
//     }
//     if (range==='month') {
//         range = IDBKeyRange.Bound(Date.now());
//     }
//     index.getAll(range).onsuccess = (e) => {
//         for (const item of e.target.result) {
//             const p = document.createElement('p');
//             let date = new Date(item.endDateTime - item.startDateTime);
//             p.textContent = `${getNowDate(item.startDateTime)} 学习${item.skillName} ${date.getHours() <= 8 ? date.getMinutes() : date.getHours() + '小时' + date.getMinutes()}分钟`;
//             logInfoDoc.appendChild(p);
//         }
//     }
// }
function selectSkillLogList() {
    const store = createStore('readonly', 'skillLog');
    const index = store.index('dateTime');
    const range = IDBKeyRange.upperBound(Date.now());
    index.getAll(range).onsuccess = (e) => {
        for (const item of e.target.result) {
            const p = document.createElement('p');
            let date = new Date(item.endDateTime - item.startDateTime);
            p.textContent = `${getNowDate(item.startDateTime)} 学习${item.skillName} ${date.getHours() <= 8 ? date.getMinutes() : date.getHours() + '小时' + date.getMinutes()}分钟`;
            logInfoDoc.appendChild(p);
        }
    }
}
function updateDataToStore2(data) {
    let store = createStore(DB_MODE, 'skillLog');
    data.dateTime = Date.now();
    store.add(data).onsuccess = (e) => {
        console.log('log数据添加成功', e.target.result);
    };
}
function logPanel(data) {


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
            maskBtDoc.focus();
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
                timerBtMode.textContent = '倒计时';
                maskDivDocs[1].style.display = 'block';
                maskDivDocs[2].style.display = 'none';
            } else {
                timerBtMode.textContent = '正计时';
                maskDivDocs[1].style.display = 'none';
                maskDivDocs[2].style.display = 'block';
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
                contentDoc.style.display = 'flex';
            } else {
                asideDoc.style.display = 'flex';
                skillInfoDoc.style.display = 'none';
                contentDoc.style.display = 'flex';
            }
            break;
        default:
            if (window.innerWidth < 450) {
                sectionDoc.style.display = 'flex';
                asideDoc.style.display = 'none';
            } else {
                asideDoc.style.display = 'flex';
                skillInfoDoc.style.display = 'none';
                contentDoc.style.display = 'flex';
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
let logItem = {};
function getNowDate(value) {
    const date = new Date(value);
    // console.log(date.getFullYear());
    // console.log(date.getMonth());
    // console.log(date.getDate());
    // console.log(date.getHours());
    // console.log(date.getMinutes());
    // console.log(date.getSeconds());
    // logItem.h=date.getHours();
    // logItem.m=date.getMinutes();
    // logItem.s=date.getSeconds();
    return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()} 
    ${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()}`
}
function onOff(obj) {
    if (obj.textContent === '暂停') {
        obj.textContent = '继续';
        clearInterval(intervalId);
        clearInterval(intervalId2);
        //保存日志
        logItem.endDateTime = Date.now();
        logItem.duration = logItem.endDateTime - logItem.startDateTime;
        updateDataToStore2(logItem);
    } else {
        //开启日志
        logItem.startDateTime = Date.now();
        logItem.skillName = currentPanel.skillName;
        logItem.skillId = currentPanel.id;
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
    }
    if (currentPanel.m == 60) {
        currentPanel.m = 0;
        currentPanel.h++;
        currentPanel.addUp++;
        currentPanel.todayAddUp++;
    }
    // console.log(`${currentPanel.h > 9 ? currentPanel.h : '0' + currentPanel.h}:${currentPanel.m > 9 ? currentPanel.m : '0' + currentPanel.m}:${currentPanel.s > 9 ? currentPanel.s : '0' + currentPanel.s}`);

    timeShows[0].textContent = `${currentPanel.h > 9 ? currentPanel.h : '0' + currentPanel.h}:${currentPanel.m > 9 ? currentPanel.m : '0' + currentPanel.m}:${currentPanel.s > 9 ? currentPanel.s : '0' + currentPanel.s}`;

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
        updateDataToStore(currentPanel);

    }
    if (currentPanel.s2 == 0) {
        currentPanel.s2 = 60;
        currentPanel.m2--;
        updateDataToStore(currentPanel);

    }
    currentPanel.s2--;
    // console.log(`${currentPanel.h2 > 9 ? currentPanel.h2 : '0' + currentPanel.h2}:${currentPanel.m2 > 9 ? currentPanel.m2 : '0' + currentPanel.m2}:${currentPanel.s2 > 9 ? currentPanel.s2 : '0' + currentPanel.s2}`);

    timeShows[1].textContent = `${currentPanel.h2 > 9 ? currentPanel.h2 : '0' + currentPanel.h2}:${currentPanel.m2 > 9 ? currentPanel.m2 : '0' + currentPanel.m2}:${currentPanel.s2 > 9 ? currentPanel.s2 : '0' + currentPanel.s2}`;

}

maskBtDoc.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.code === 'Escape') {
        maskBtDoc.style.visibility = 'hidden';
        //看板更新
        const div = document.getElementById(currentPanel.id);
        fillPanel(div, currentPanel);
        sectionDoc.prepend(div);

        clearInterval(intervalId);
        clearInterval(intervalId2);
        //数据库更新
        updateDataToStore(currentPanel);
        //日志
        logItem.endDateTime = Date.now();
        logItem.duration = logItem.endDateTime - logItem.startDateTime;
        updateDataToStore2(logItem);
    } else if (e.code === 'Space') {
        onOff(onOffDoc);
    }

})
const liTagDocs = document.querySelectorAll('.content li');
// 监听a标签
contentDoc.addEventListener('click', (e) => {
    console.log(e.target.id);
    switch (e.target.id) {
        case 'log':
            contentDivDoc[0].style.display = 'block';
            contentDivDoc[1].style.display = 'none';
            contentDivDoc[2].style.display = 'none';
            liTagDocs[0].style.background = '#EEE';
            liTagDocs[1].style.background = 'inherit';
            liTagDocs[2].style.background = 'inherit';
            break;
        case 'statistics':
            contentDivDoc[0].style.display = 'none';
            contentDivDoc[1].style.display = 'block';
            contentDivDoc[2].style.display = 'none';
            liTagDocs[0].style.background = 'inherit';
            liTagDocs[1].style.background = '#EEE';
            liTagDocs[2].style.background = 'inherit';
            break;
        case 'instructions':
            contentDivDoc[0].style.display = 'none';
            contentDivDoc[1].style.display = 'none';
            contentDivDoc[2].style.display = 'block';
            liTagDocs[0].style.background = 'inherit';
            liTagDocs[1].style.background = 'inherit';
            liTagDocs[2].style.background = '#EEE';
            break;
        default:
            break;
    }
})
// 监听页面关闭
window.addEventListener('unload', () => {
    logItem.endDateTime = Date.now();
    logItem.duration = logItem.endDateTime - logItem.startDateTime;
    updateDataToStore2(logItem);
})

// 后台运行逻辑
const worke = new Worker('js/timer.js')
document.addEventListener('visibilitychange', () => {
    if (document.hidden && maskBtDoc.style.visibility === 'visible') {
        console.log('页面隐藏，降低任务频率');
        worke.postMessage(['start', currentPanel])
        // 调整任务逻辑
    } else if (!document.hidden && maskBtDoc.style.visibility === 'visible') {

        worke.postMessage('end')
        worke.onmessage = (e) => {
            currentPanel = e.data;
            console.log('时间', e.data);
        }
        console.log('页面激活，恢复任务频率');

        // 恢复任务逻辑
    }
});

// 统计图
const canvas = document.getElementById('lineChart');
    const ctx = canvas.getContext('2d');
    const tooltip = document.getElementById('tooltip');

    // 数据
    const data = [
      { date: '2023-11-01', value: 30 },
      { date: '2023-11-02', value: 50 },
      { date: '2023-11-03', value: 40 },
      { date: '2023-11-04', value: 70 },
      { date: '2023-11-05', value: 60 },
      { date: '2023-11-06', value: 160 },
      { date: '2023-11-07', value: 60 },
      { date: '2023-11-08', value: 70 },
      { date: '2023-11-09', value: 60 }

    ];

    // 图表配置,,,,,
    const padding = 50; // 内边距
    const width = canvas.width - padding * 2; // 绘图区域宽度
    const height = canvas.height - padding * 2; // 绘图区域高度
    const pointRadius = 5; // 数据点半径

    // 获取数据范围
    const xValues = data.map(d => new Date(d.date).getTime());
    const yValues = data.map(d => d.value);
    const xMin = Math.min(...xValues);
    const xMax = Math.max(...xValues);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);

    // 坐标转换函数
    const xScale = value => padding + ((value - xMin) / (xMax - xMin)) * width;
    const yScale = value => canvas.height - padding - ((value - yMin) / (yMax - yMin)) * height;

    // 绘制坐标轴
    function drawAxes() {
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, canvas.height - padding); // Y 轴
      ctx.lineTo(canvas.width - padding, canvas.height - padding); // X 轴
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Y 坐标标签
      const ySteps = 5;
      for (let i = 0; i <= ySteps; i++) {
        const yValue = yMin + ((yMax - yMin) / ySteps) * i;
        const yPos = canvas.height - padding - (height / ySteps) * i;
        ctx.fillText(yValue.toFixed(0), padding - 30, yPos + 5);
      }

      // X 坐标标签
      data.forEach(d => {
        const xPos = xScale(new Date(d.date).getTime());
        ctx.fillText(d.date, xPos - 30, canvas.height - padding + 20);
      });
    }

    // 绘制折线图
    function drawLineChart() {
      ctx.beginPath();
      ctx.moveTo(xScale(xValues[0]), yScale(yValues[0]));
      for (let i = 1; i < data.length; i++) {
        ctx.lineTo(xScale(xValues[i]), yScale(yValues[i]));
      }
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制数据点
      data.forEach(d => {
        ctx.beginPath();
        ctx.arc(xScale(new Date(d.date).getTime()), yScale(d.value), pointRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
      });
    }

    // 显示数据点信息
    canvas.addEventListener('click', event => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      let closestPoint = null;
      let closestDistance = Infinity;

      data.forEach(d => {
        const dx = mouseX - xScale(new Date(d.date).getTime());
        const dy = mouseY - yScale(d.value);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < closestDistance && distance < pointRadius * 2) {
          closestPoint = d;
          closestDistance = distance;
        }
      });

      if (closestPoint) {
        tooltip.style.left = `${event.clientX}px`;
        tooltip.style.top = `${event.clientY - 20}px`;
        tooltip.textContent = `Date: ${closestPoint.date}, Value: ${closestPoint.value}`;
        tooltip.style.display = 'block';
      } else {
        tooltip.style.display = 'none';
      }
    });

    // 初始化图表
    function initChart() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawAxes();
      drawLineChart();
    }

    initChart();