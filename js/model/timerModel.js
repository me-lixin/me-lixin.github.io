// 计时器类
export class Timer {
    logItem={};
    touchCount=0;
    // 正计时
    run(currentPanel,timeShows,tiemLog) {
        currentPanel.s++;
        currentPanel.addUp = Number(currentPanel.addUp) + 1000;
        currentPanel.todayAddUp = Number(currentPanel.todayAddUp) + 1000;
        if (currentPanel.s == 60) {
            currentPanel.s = 0;
            currentPanel.m++;
            tiemLog.updateLog(currentPanel);
        }
        if (currentPanel.m == 60) {
            currentPanel.m = 0;
            currentPanel.h++;
        }
        timeShows[0].textContent = `${currentPanel.h > 9 ? currentPanel.h : '0' + currentPanel.h}:${currentPanel.m > 9 ? currentPanel.m : '0' + currentPanel.m}:${currentPanel.s > 9 ? currentPanel.s : '0' + currentPanel.s}`;
    }
    // 倒计时
    run2(currentPanel,timeShows) {
        currentPanel.sumNeedTime = Number(currentPanel.sumNeedTime) - 1000;
        currentPanel.todayNeedTime = Number(currentPanel.todayNeedTime) - 1000;
        if (currentPanel.m2 == 0 && currentPanel.s2 == 0) {
            currentPanel.m2 = 60;
            currentPanel.h2--;
        }
        if (currentPanel.s2 == 0) {
            currentPanel.s2 = 60;
            currentPanel.m2--;
        }
        currentPanel.s2--;
        timeShows[1].textContent = `${(currentPanel.h2 > 9 || currentPanel.h2 < 0) ? currentPanel.h2 : '0' + currentPanel.h2}:${currentPanel.m2 > 9 ? currentPanel.m2 : '0' + currentPanel.m2}:${currentPanel.s2 > 9 ? currentPanel.s2 : '0' + currentPanel.s2}`;
    }
    // 计时模式切换
    timerModeSwitch(modeDiv, maskDivDocs) {
        if (modeDiv.textContent === '倒计时') {
            modeDiv.textContent = '正计时';
            this.currentPanel.timerMode = '1'
            modeDiv.className = 'timer-mode increase'
            maskDivDocs[1].style.display = 'none';
            maskDivDocs[2].style.display = 'block';
        } else {
            modeDiv.textContent = '倒计时';
            this.currentPanel.timerMode = '0'
            modeDiv.className = 'timer-mode reduce'
            maskDivDocs[2].style.display = 'none';
            maskDivDocs[1].style.display = 'block';
        }
    }
    onOff(obj, tiemLog,currentPanel,timeShows){
        if (obj.value === 'off') {
            obj.value = 'on';
            obj.className = 'on-off on'
            clearInterval(this.intervalId);
            clearInterval(this.intervalId2);
            reset.classList.toggle('display-none', false);
            //保存日志
            this.logItem.endDateTime = Date.now();
            this.logItem.duration = this.logItem.endDateTime - this.logItem.startDateTime;
            tiemLog.updateLog(this.logItem);
        } else {
            //开启日志
            this.logItem.startDateTime = Date.now();
            this.logItem.skillName = currentPanel.skillName;
            this.logItem.skillId = currentPanel.id;
            obj.value = 'off';
            obj.className = 'on-off off'
            this.intervalId = setInterval(this.run, 1000,currentPanel,timeShows,tiemLog);
            this.intervalId2 = setInterval(this.run2, 1000,currentPanel,timeShows);
            reset.classList.toggle('display-none', true);
        }
    }
    // 后台计时逻辑
    restorationTiem(currentPanel,timeShows,tiemLog) {
        let timeDifference = Date.now() - this.timeStamp;
        // let timeDifference = MILLISECOND/24 ;
        let h = Math.trunc(timeDifference / 1000 / 60 / 60);
        let m = Math.trunc(timeDifference / 1000 / 60 % 60);
        let s = Math.trunc(timeDifference / 1000 % 60);
        currentPanel.h = Number(currentPanel.h) + h;
        currentPanel.m = Number(currentPanel.m) + m;
        currentPanel.s = Number(currentPanel.s) + s;
        if (currentPanel.m >= 60) {
            currentPanel.h++;
            currentPanel.m -= 60;
        }
        if (currentPanel.s >= 60) {
            currentPanel.m++;
            currentPanel.s -= 60;
        }
        currentPanel.h2 = Number(currentPanel.h2) - h;
        currentPanel.m2 = Number(currentPanel.m2) - m;
        currentPanel.s2 = Number(currentPanel.s2) - s;
        if (currentPanel.m2 <= 0) {
            currentPanel.h2--;
            currentPanel.m2 += 60;
        }
        if (currentPanel.s2 <= 0) {
            currentPanel.m2--;
            currentPanel.s2 += 60;
        }

        this.run(currentPanel,timeShows);
        this.run2(currentPanel,timeShows);
        currentPanel.sumNeedTime = currentPanel.sumNeedTime - timeDifference;
        currentPanel.todayNeedTime = currentPanel.todayNeedTime - timeDifference;
        currentPanel.addUp = currentPanel.addUp + timeDifference;
        currentPanel.todayAddUp = currentPanel.todayAddUp + timeDifference;
        this.intervalId = setInterval(this.run, 1000,currentPanel,timeShows,tiemLog);
        this.intervalId2 = setInterval(this.run2, 1000,currentPanel,timeShows);
    }
}
