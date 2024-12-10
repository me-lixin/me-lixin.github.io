// 技能信息类
export class Skills {
    dataMap = new Map();
    // 查询
    selectSkill() {
        const store = this.skDB.createStore(this.skDB.dbMode[0], this.skDB.dbStoreName[0],this.skDB.db)
        const index = store.index('dateTime');
        index.openCursor().onsuccess = (e) => {
            const cursor = e.target.result
            if (cursor) {
                this.dataToElement(e.target.result.value)
                cursor.continue();
            }
        }
    }
    // 更新
    updateSkill(data) {
        const store = this.skDB.createStore(this.skDB.dbMode[0], this.skDB.dbStoreName[0],this.skDB.db)
        this.defaultDataFill(data);
        store.put(data).onsuccess = (e) => {
            console.log('数据更新成功', e.target.result);
            this.dataToElement(data);
        };
    }
    // 删除
    deleteSkill(dataId) {
        const store = this.skDB.createStore(this.skDB.dbMode[0], this.skDB.dbStoreName[0],this.skDB.db)
        store.delete(dataId).onsuccess = () => {
            console.log('数据删除成功', dataId);
        }
    }
    // 将数据传入页面元素
    dataToElement(item) {
        this.dataMap.set(item.id, item);
        this.constructorPanel(item)
    }
    // 构造或获取一个div面板,用于回显数据,并开始填充准备
    constructorPanel(data) {
        const div = document.getElementById(data.id) || document.createElement('div');
        div.setAttribute('id', data.id)
        this.fillPanel(div, data);
        this.sectionDoc.prepend(div);
    }
    // 将data中的数据填充到div面板
    fillPanel(div, data) {
        div.innerHTML = `
    <h2>${data.skillName}</h2>
    <p>你要用<b>${data.skillTime}</b>个小时来学<strong>[${data.skillName}]</strong>,要是学不会,你将<b>[生不如死]</b>!</p>
    <ul>
        <li>累计学习:<b>${Math.ceil(data.addUp == 0 ? 0 : data.addUp / 1000 / 60 / 60)}</b>小时</li>
        <li>今天计划学:<b>${data.todayTime}</b>小时</li>
        <li>今天已学习:<b>${Math.ceil(data.todayAddUp == 0 ? 0 : data.todayAddUp / 1000 / 60 / 60)}</b>小时</li>
        <li>今天还需学:<b>${Math.trunc(data.todayNeedTime <= 0 ? 0 : data.todayNeedTime / 1000 / 60 / 60)}</b>小时</li>
        <li>距离学会还剩:<b>${Math.trunc(data.sumNeedTime <= 0 ? 0 : data.sumNeedTime / 1000 / 60 / 60)}</b>小时</li>
    </ul>
    <button type="button" class="delete-skill"></button>
    <button value=${data.id} type="button" class="start-skill on"></button>`
    }
    // 点击div面板的时候将对应的data数据填充到表单
    fillForm(item,durationDoc,formDoc) {
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
                this.durationFill(input,durationDoc)
            } else {
                input.value = item[key];
            }
        }
    }
    // 用于设置和获取skill的id,这在新增和修改的时候有用
    getSkillId() {
        if (localStorage.getItem('skillId')) {
            let id = Number(localStorage.getItem('skillId')) + 1
            localStorage.setItem('skillId', id)
            return id;
        } else {
            localStorage.setItem('skillId', 1);
            return 1;
        }
    }
    // 在更新数据之前将,初始化一下数据
    defaultDataFill(data) {
        data.dateTime = Date.now();
        data.addUp = data.addUp || 0;
        data.todayAddUp = data.todayAddUp || 0;
        data.todayNeedTime = Number(data.todayTime) * 1000 * 60 * 60 - Number(data.todayAddUp);
        data.sumNeedTime = Number(data.skillTime) * 1000 * 60 * 60 - Number(data.addUp);
        data.h = data.h || 0;
        data.m = data.m || 0;
        data.s = data.s || 0;
        data.h2 = Math.trunc((Number(data.todayTime) * 1000 * 60 * 60 - Number(data.todayAddUp)) / 1000 / 60 / 60);
        data.m2 = data.m2 || 0;
        data.s2 = data.s2 || 0;
        data.timerMode = data.timerMode || '0';
    }
    // range类型的input回显
    durationFill(range,durationDoc) {
        if (range.value >= 200) {
            durationDoc[0].textContent = range.value;
        } else {
            durationDoc[1].textContent = range.value;
        }
    }
}

