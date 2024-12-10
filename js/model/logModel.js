// 时间日志类
export class TimeLog {
    count=0;
    //根据年月查询
    selectLogToStatistics(offset, statistics) {
        this.logList = [];
        const store = this.skDB.createStore(this.skDB.dbMode[1], this.skDB.dbStoreName[1],this.skDB.db)
        const index = store.index('dateTime');
        const now = new Date();
        const lastMonth = new Date(now.getFullYear()
            , now.getMonth() - offset
            , now.getDate(), 0, 0, 0);
        let current;
        let offsetTem;
        let lastMax;
        let range;
        if (offset == 1) {
            current = now.getDate() + 1;
            offsetTem = 30;
            let num = current - offsetTem;
            lastMax = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            for (let i = 0; i < offsetTem; i++) {
                if (num <= 0) {
                    let lastDay = lastMax + num;
                    this.logList.push({
                        'label': `${now.getMonth() > 9 ? now.getMonth() : '0' + now.getMonth()}-${lastDay > 9 ? lastDay : '0' + lastDay}`
                        , 'month': now.getMonth() - 1, 'day': lastDay
                    });
                    num++;
                } else {
                    this.logList.push({
                        'label': `${now.getMonth() + 1 > 9 ? now.getMonth() + 1 : '0' + now.getMonth() + 1}-${num > 9 ? num : '0' + num}`
                        , 'month': now.getMonth(), 'day': num
                    });
                    num++;
                }
            }
        } else {
            offsetTem = 12;
            current = now.getMonth() + 1;
            let num = current - offsetTem;
            lastMax = new Date(now.getFullYear(), 0, 0).getMonth() + 1;
            for (let i = 0; i < offsetTem; i++) {
                if (num < 0) {
                    let month = lastMax + num;
                    this.logList.push({
                        'label': `${now.getFullYear() > 9 ? now.getFullYear() - 1 : '0' + now.getFullYear()}-${month + 1 > 9 ? month + 1 : '0' + (month + 1)}`
                        , 'year': now.getFullYear() - 1, 'month': month
                    });
                    num++;
                } else {
                    this.logList.push({
                        'label': `${now.getFullYear() + 1 > 9 ? now.getFullYear() : '0' + now.getFullYear() + 1}-${num + 1 > 9 ? num + 1 : '0' + (num + 1)}`
                        , 'year': now.getFullYear(), 'month': num
                    });
                    num++;
                }
            }
            range = IDBKeyRange.bound(lastMonth.valueOf(), Date.now());
        }

        index.getAll(range).onsuccess = (e) => {
            for (let i = 0; i < this.logList.length; i++) {
                let sum = 0;
                for (const item of e.target.result) {
                    const year = new Date(item.startDateTime).getFullYear();
                    const month = new Date(item.startDateTime).getMonth();
                    const itemDay = new Date(item.startDateTime).getDate();
                    if (year == this.logList[i].year && month == this.logList[i].month) {
                        sum += item.duration;
                    }
                    if (month == this.logList[i].month && itemDay == this.logList[i].day) {
                        sum += item.duration;
                    }
                }
                this.logList[i].data = Math.floor(sum / 1000 / 60 / 60);
            }
            // 初次绘制
            statistics.list = this.logList
            statistics.initChart(offset == 1 ? 15 : 450);
        }
    }
    // 查询
    selectLog(startTime, endTime) {
        const store = this.skDB.createStore(this.skDB.dbMode[1], this.skDB.dbStoreName[1],this.skDB.db)
        const index = store.index('dateTime');
        if (startTime == 0) {
            return new Promise((resolve) => {
                index.getAll().onsuccess = (e) => {
                    resolve(e.target.result);
                }
            })
        }
        const range = IDBKeyRange.bound(startTime, endTime);
        //index.openCursor(range, 'prev')降序查询
        const title = document.createElement('p');
        title.innerHTML = `<strong>${this.getNowDate(endTime)}</strong>`;
        loading.before(title);
        index.openCursor(range, 'prev').onsuccess = (e) => {
            const cursor = e.target.result
            if (cursor) {
                let item = cursor.value
                const content = document.createElement('p');
                let hours = Math.trunc(item.duration / 1000 / 60 / 60);
                let minutes = Math.trunc(item.duration / 1000 / 60 % 60);
                content.innerHTML = `[${this.getNowTime(item.startDateTime)}]
            学习<strong>[${item.skillName}]
            </strong> <b>${hours}</b>小时<b>${minutes}</b>分钟`;
                //在loading标签前面插入
                loading.before(content);
                cursor.continue();
            }
        }
    }
    // 添加
    updateLog(data) {
        if (data.duration < 60000) {
            return;
        }
        const store = this.skDB.createStore(this.skDB.dbMode[0], this.skDB.dbStoreName[1],this.skDB.db)
        data.dateTime = data.startDateTime;
        store.put(data).onsuccess = (e) => {
            this.logPanel(data);
            console.log('log数据添加成功', e.target.result);
        };
    }
    // 日志回显
    logPanel(data) {
        let firstLog = this.logInfoDoc.firstElementChild;
        if (firstLog.textContent != this.getNowDate(data.startDateTime)) {
            let newFirstLog = document.createElement('p');
            newFirstLog.innerHTML = `<strong>${this.getNowDate(data.startDateTime)}</strong>`;
            firstLog.before(newFirstLog);
            firstLog = newFirstLog;
        }
        const content = document.createElement('p');
        let hours = Math.trunc(data.duration / 1000 / 60 / 60);
        let minutes = Math.trunc(data.duration / 1000 / 60 % 60);
        content.innerHTML = `[${this.getNowTime(data.startDateTime)}]
        学习<strong>[${data.skillName}]
        </strong> <b>${hours}</b>小时<b>${minutes}</b>分钟`;
        firstLog.after(content);
    }
    // 获取指定时分秒
    getNowTime(value) {
        const date = new Date(value);
        return `${date.getHours() > 9 ? date.getHours() : '0' + date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes()}:${date.getSeconds() > 9 ? date.getSeconds() : '0' + date.getSeconds()}`
    }
    // 获取指定年月日
    getNowDate(value) {
        const date = new Date(value);
        return `${date.getFullYear()}-${date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)}-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`
    }
    // 下载日志
    async downloadLog() {
        const logList = await selectLog(0, Date.now())
        let logStr = '';
        for (const item of logList) {
            const content = document.createElement('p');
            let hours = Math.trunc(item.duration / 1000 / 60 / 60);
            let minutes = Math.trunc(item.duration / 1000 / 60 % 60);
            logStr += `<br>[${this.getNowDate(item.startDateTime)} ${this.getNowTime(item.startDateTime)}]
            学习<strong>[${item.skillName}]
            </strong> <b>${hours}</b>小时<b>${minutes}</b>分钟`;
        }
        const blob = new Blob([logStr], { type: "text/html" });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = '日志.html';
        link.click();
    }
}




