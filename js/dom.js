import { SkillDB } from "./model/dbModel.js";
import { SKLayout } from "./model/layoutModel.js";
import { TimeLog } from "./model/logModel.js";
import { Skills } from "./model/skillModel.js";
import { Statistics } from "./model/statisticsModel.js";
import { Timer } from "./model/timerModel.js";

// 添加按钮
const addSkillDoc = document.querySelector('.add-skill');
// 侧边栏
const asideDoc = document.querySelector('main aside');
// 卡片区域
const sectionDoc = document.querySelector('main section');
// 侧边栏的技能页
const skillInfoDoc = document.querySelector('.skill-info')
// 侧边栏返回按钮
const backDoc = document.querySelector('.return')
// form表单里面type为range的input
const rangeDoc = document.querySelectorAll('.skill-form input[type="range"]')
// form表单里根据用户选择而显示的时间范围
const durationDoc = document.querySelectorAll('.duration')
// 侧边栏的内容页,包括日志/报表/说明
const contentDoc = document.querySelector('.content')
// 内容页里面的所有div页面,也就是内容页面
const contentDivDoc = document.querySelectorAll('.content>div')
// 内容页面里面的log页面
const logInfoDoc = document.querySelector('.log-info');
// 蒙版页面
const maskBtDoc = document.querySelector('.mask');
// 蒙版页面里的所有div
const maskDivDocs = document.querySelectorAll('.mask div');
// 技能页面的Form表单
const formDoc = document.getElementById('skillForm')
// 菜单按钮
const menuBtDoc = document.querySelector('.menu');
// 蒙版页的计时模式按钮
const timerBtMode = document.querySelector('.timer-mode');
// 内容页的所有li元素
const liTagDocs = document.querySelectorAll('.content li');
// 下载按钮
const download = document.querySelector('.download');
// 年度/阅读报表的切换按钮
const swtichBtDoc = document.querySelector('.switch');

// 计时开关按钮
const onOffDoc = document.querySelector('#onOff');
// 显示计时器的元素,包含正计时和倒计时
const timeShows = document.querySelectorAll('.time-show');
// 重置当天计时情况的按钮
const reset = document.querySelector('#reset');
/**
 * 步骤:
 * 1. 先创建数据库
 * 2. 根据需要回显页面数据
 * 3. 为页面各个功能添加事件
 */
//创建数据库对象
const skDB = new SkillDB();
const db = await skDB.initalizeDB();
skDB.db = db;
// 创建技能对象
const skill = new Skills();
skill.sectionDoc = sectionDoc;
skill.skDB = skDB;
skill.selectSkill(skDB);
// 创建日志对象
const tiemLog = new TimeLog();
tiemLog.skDB = skDB;
tiemLog.logInfoDoc = logInfoDoc;
const now = new Date();
tiemLog.selectLog(new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf()
    , Date.now());
SKLayout.contentShow(sectionDoc, contentDoc, skillInfoDoc, asideDoc, 'menu');
// 创建报表对象
const statistics = new Statistics();
tiemLog.selectLogToStatistics(1, statistics);

// 创建计时器类
const timer = new Timer();

// 监听Form表单的reset
formDoc.addEventListener('reset', () => {
    durationDoc[0].textContent = '600';
    durationDoc[1].textContent = '9';
    for (const item of formDoc) {
        if (item.type === 'hidden') {
            item.value = 0;
        }
    }
})
// 添加技能按钮
addSkillDoc.addEventListener('click', () => {
    let hiddenNode = document.querySelector('#id')
    if (hiddenNode) {
        hiddenNode.parentNode.removeChild(hiddenNode);
    }
    formDoc.reset();
    SKLayout.contentShow(sectionDoc, contentDoc, skillInfoDoc, asideDoc, 'skill');
})
// 返回按钮
backDoc.addEventListener('click', () => {
    if (window.innerWidth < 650) {
        sectionDoc.classList.toggle('display-none', false)
        asideDoc.classList.toggle('display-none', true)
    } else {
        asideDoc.classList.toggle('display-none', true)

    }
})
// 菜单按钮
menuBtDoc.addEventListener('click', () => {
    SKLayout.contentShow(sectionDoc, contentDoc, skillInfoDoc, asideDoc, 'menu');
})
// 保存按钮
formDoc.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(formDoc)
    if (!formData.has('id')) {
        let id = skill.getSkillId();
        formData.append('id', id)
    }
    skill.updateSkill(Object.fromEntries(formData))
    SKLayout.contentShow(sectionDoc, contentDoc, skillInfoDoc, asideDoc,);
})

sectionDoc.addEventListener('click', async (e) => {
    let divDoc;
    if (e.target.id) {
        divDoc = e.target;
    }
    if (e.target.parentNode.id) {
        divDoc = e.target.parentNode;
    }
    if (e.target.parentNode.parentNode.id) {
        divDoc = e.target.parentNode.parentNode;
    }
    if (e.target.parentNode.parentNode.parentNode.id) {
        divDoc = e.target.parentNode.parentNode.parentNode;
    }
    if (e.target.className === 'start-skill on') {
        maskBtDoc.style.visibility = 'visible';
        maskBtDoc.focus();
        timer.currentPanel = skill.dataMap.get(divDoc.id)
        onOffDoc.value = 'on';
        timeShows[0].textContent = `${timer.currentPanel.h > 9 ? timer.currentPanel.h : '0' + timer.currentPanel.h}:${timer.currentPanel.m > 9 ? timer.currentPanel.m : '0' + timer.currentPanel.m}:${timer.currentPanel.s > 9 ? timer.currentPanel.s : '0' + timer.currentPanel.s}`;
        timeShows[1].textContent = `${timer.currentPanel.h2 > 9 ? timer.currentPanel.h2 : '0' + timer.currentPanel.h2}:${timer.currentPanel.m2 > 9 ? timer.currentPanel.m2 : '0' + timer.currentPanel.m2}:${timer.currentPanel.s2 > 9 ? timer.currentPanel.s2 : '0' + timer.currentPanel.s2}`;

        if (timer.currentPanel.timerMode === '0') {
            timerBtMode.textContent = '倒计时';
            timerBtMode.className = 'timer-mode reduce'
            maskDivDocs[1].classList.toggle('display-none', false);
            maskDivDocs[2].classList.toggle('display-none', true);
        } else {
            timerBtMode.textContent = '正计时';
            timerBtMode.className = 'timer-mode increase'
            maskDivDocs[1].classList.toggle('display-none', true);
            maskDivDocs[2].classList.toggle('display-none', false);
        }
        timer.onOff(onOffDoc, tiemLog, timer.currentPanel, timeShows);
        return;
    }
    if (e.target.className === 'delete-skill') {
        skill.deleteSkill(divDoc.id);
        divDoc.parentNode.removeChild(divDoc);
        formDoc.reset();
        return;
    }
    if (divDoc) {
        skill.fillForm(skill.dataMap.get(divDoc.id), durationDoc, formDoc)
        SKLayout.contentShow(sectionDoc, contentDoc, skillInfoDoc, asideDoc, 'skill');
    }
})
// 范围输入框输入事件
for (const range of rangeDoc) {
    range.addEventListener('input', () => {
        if (range.value >= 200) {
            durationDoc[0].textContent = range.value;
        } else {
            durationDoc[1].textContent = range.value;
        }
    })
}
// 暂停开始
onOffDoc.addEventListener('click', (e) => {
    e.stopPropagation()
    timer.onOff(onOffDoc, tiemLog, timer.currentPanel, timeShows);
})
// 重置当天及时情况
reset.addEventListener('click', (e) => {
    e.stopPropagation()
    //保存日志
    //重置当前数据
    timer.currentPanel.h = 0;
    timer.currentPanel.todayAddUp = 0;
    timer.currentPanel.todayNeedTime = timer.currentPanel.todayTime;
    timer.currentPanel.h = 0;
    timer.currentPanel.m = 0;
    timer.currentPanel.s = 0;
    timer.currentPanel.h2 = timer.currentPanel.todayTime;
    timer.currentPanel.m2 = 0;
    timer.currentPanel.s2 = 0;
    timeShows[1].textContent = `${timer.currentPanel.h2 > 9 ? timer.currentPanel.h2 : '0' + timer.currentPanel.h2}:${timer.currentPanel.m2 > 9 ? timer.currentPanel.m2 : '0' + timer.currentPanel.m2}:${timer.currentPanel.s2 > 9 ? timer.currentPanel.s2 : '0' + timer.currentPanel.s2}`;
    timeShows[0].textContent = `${timer.currentPanel.h > 9 ? timer.currentPanel.h : '0' + timer.currentPanel.h}:${timer.currentPanel.m > 9 ? timer.currentPanel.m : '0' + timer.currentPanel.m}:${timer.currentPanel.s > 9 ? timer.currentPanel.s : '0' + timer.currentPanel.s}`;

    skill.updateSkill(timer.currentPanel);
})
// 计时模式切换
timerBtMode.addEventListener('click', (e) => {
    e.stopPropagation()
    timer.timerModeSwitch(e.target, maskDivDocs, timer.currentPanel);
})
// 监听键盘事件
maskBtDoc.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.code === 'Escape') {
        //看板更新
        maskBtDoc.style.visibility = 'hidden';
        skill.fillForm(timer.currentPanel, durationDoc, formDoc);
        clearInterval(timer.intervalId);
        clearInterval(timer.intervalId2);
        //数据库更新
        skill.updateSkill(timer.currentPanel);

        //日志
        if (onOffDoc.value === 'off') {
            timer.logItem.endDateTime = Date.now();
            timer.logItem.duration = timer.logItem.endDateTime - timer.logItem.startDateTime;
            timer.onOff(onOffDoc, tiemLog, timer.currentPanel, timeShows);
        }
    } else if (e.code === 'Space') {
        timer.onOff(onOffDoc, tiemLog, timer.currentPanel, timeShows);
    } else if (e.code === 'Tab') {
        timer.timerModeSwitch(timerBtMode, maskDivDocs, timer.currentPanel);
    }
})
// 监听双击事件
maskBtDoc.addEventListener('click', () => {
    timer.touchCount++;
    if (timer.touchCount > 1) {
        timer.touchCount = 0;
        //看板更新
        maskBtDoc.style.visibility = 'hidden';
        skill.fillForm(timer.currentPanel, durationDoc, formDoc);
        clearInterval(timer.intervalId);
        clearInterval(timer.intervalId2);
        //技能数据库更新
        skill.updateSkill(timer.currentPanel);
        //日志
        if (onOffDoc.value === 'off') {
            timer.logItem.endDateTime = Date.now();
            timer.logItem.duration = timer.logItem.endDateTime - timer.logItem.startDateTime;
            timer.onOff(onOffDoc, tiemLog, timer.currentPanel, timeShows);
        }
    }
});
// 监听标签切换
contentDoc.addEventListener('click', (e) => {
    SKLayout.switchTag(contentDivDoc, liTagDocs, e.target.id)
})
//加载更多日志
loading.addEventListener('click', (e) => {
    loading.textContent = '加载中......'
    loading.disabled = true;
    setTimeout(() => {
        const now = new Date();
        tiemLog.selectLog(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (tiemLog.count + 1)).valueOf()
            , new Date(now.getFullYear(), now.getMonth(), now.getDate() - tiemLog.count).valueOf() - 1,);
        tiemLog.count++;
        loading.textContent = '点击加载历史数据'
        loading.disabled = false;
        loading.classList.toggle('display-none', false);
    }, 500);
})
// 下载日志
download.addEventListener('click', async (e) => {
    const logList = await tiemLog.selectLog(0, Date.now(),)
    let logStr = '';
    for (const item of logList) {
        const content = document.createElement('p');
        let hours = Math.trunc(item.duration / 1000 / 60 / 60);
        let minutes = Math.trunc(item.duration / 1000 / 60 % 60);
        logStr += `<br>[${tiemLog.getNowDate(item.startDateTime)} ${tiemLog.getNowTime(item.startDateTime)}]
        学习<strong>[${item.skillName}]
        </strong> <b>${hours}</b>小时<b>${minutes}</b>分钟`;
    }
    const blob = new Blob([logStr], { type: "text/html" });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '日志.html';
    link.click();

});
// 监听统计报表切换
swtichBtDoc.addEventListener('click', (e) => {
    if (e.target.textContent == '年') {
        e.target.textContent = '月';
        tiemLog.selectLogToStatistics(12, statistics);
    } else {
        e.target.textContent = '年';
        tiemLog.selectLogToStatistics(1, statistics);
    }
})
// 监听页面关闭
window.addEventListener('unload', () => {
    timer.logItem.endDateTime = Date.now();
    timer.logItem.duration = timer.logItem.endDateTime - timer.logItem.startDateTime;
    tiemLog.updateLog(timer.logItem);
    if (timer.currentPanel) skill.updateSkill(timer.currentPanel);
})

// 后台运行逻辑
document.addEventListener('visibilitychange', () => {
    if (document.hidden && onOffDoc.value === 'off') {
        console.log('页面隐藏，降低任务频率');
        timer.timeStamp = Date.now();
        clearInterval(timer.intervalId);
        clearInterval(timer.intervalId2);
    } else if (!document.hidden && onOffDoc.value === 'off') {
        console.log('页面激活，恢复任务频率');
        // 恢复任务逻辑
        timer.restorationTiem(timer.currentPanel, timeShows, tiemLog);
    }
});
// 监听鼠标移动事件
statistics.canvas.addEventListener('mousemove', (e)=>{
    statistics.showTooltip(e);

})

// 缓存图片资源
const root = document.querySelector(':root');
let bgArr = ['background', 'add', 'delete', 'increase', 'menu', 'reduce', 'reset', 'start', 'stop', 'return'];
for (const bg of bgArr) {
    let url;
    if (bg === 'background') {
        url = 'images/' + bg + '.jpg'
    } else {
        url = 'images/' + bg + '.svg'
    }
    caches.match(url).then(response => {
        if (!response) {
            caches.open('my-cache').then(cache => cache.add(url));
            fetch(url)
                .then(resp => resp.blob())
                .then((blob) => root.style.setProperty('--' + bg + '-bg', `url('${URL.createObjectURL(blob)}')`));
        } else {
            return response.blob();
        }
    }).then(blob => {
        if (blob) root.style.setProperty('--' + bg + '-bg', `url('${URL.createObjectURL(blob)}')`)
    })
}
