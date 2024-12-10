// 统计图表类
export class Statistics {
    tooltip = document.querySelector('.tooltip');
    offscreenCanvas = new OffscreenCanvas(300, 260);
    offCtx = this.offscreenCanvas.getContext('2d');
    canvas = document.getElementById('lineChart');
    ctx = this.canvas.getContext('2d');
    // 绘制坐标系和刻度
    drawGrid(maxData) {
        const padding = 30;
        const width = this.offscreenCanvas.width - padding * 2;
        const height = this.offscreenCanvas.height - padding * 2;
        const stepX = width / (this.list.length - 1);
        const stepY = height / maxData;

        // 绘制 X 轴和 Y 轴
        this.offCtx.beginPath();
        this.offCtx.moveTo(padding, padding - 15);
        this.offCtx.lineTo(padding, this.offscreenCanvas.height - padding);
        this.offCtx.lineTo(this.offscreenCanvas.width - padding + 15, this.offscreenCanvas.height - padding);
        this.offCtx.strokeStyle = '#000';
        this.offCtx.stroke();
        this.offCtx.font = '14px monospace';
        this.offCtx.fillText(maxData == 15 ? '月度统计' : '年度统计', this.offscreenCanvas.width / 2, padding / 2);
        this.offCtx.font = '12px monospace';

        // 绘制 X 轴刻度
        this.list.forEach((item, i) => {
            const x = padding + i * stepX;
            if (maxData == 15 && i != 0 && i % 4 == 0) {
                this.offCtx.moveTo(x, this.offscreenCanvas.height - padding)
                this.offCtx.lineTo(x, this.offscreenCanvas.height - padding + 5)
                this.offCtx.stroke();
                this.offCtx.fillText(item.day > 9 ? item.day : '0' + item.day, x - 3, this.offscreenCanvas.height - padding + 20);
            }
            if (maxData == 450 && i != 0 && i % 2 == 0) {
                this.offCtx.moveTo(x, this.offscreenCanvas.height - padding)
                this.offCtx.lineTo(x, this.offscreenCanvas.height - padding + 5)
                this.offCtx.stroke();
                this.offCtx.fillText(item.month + 1 > 9 ? item.month + 1 : '0' + (item.month + 1), x - 3, this.offscreenCanvas.height - padding + 20);
            }
        });

        // 绘制 Y 轴刻度
        for (let i = 0; i <= maxData; i++) {
            const y = this.offscreenCanvas.height - padding - (i * stepY);
            if (maxData == 15 && i != 0 && i % 3 == 0) {
                this.offCtx.moveTo(padding - 5, y)
                this.offCtx.lineTo(padding, y)
                this.offCtx.stroke();
                this.offCtx.fillText(i > 9 ? i : '0' + i, padding - 22, y + 3);
            }
            if (maxData == 450 && i != 0 && i % 50 == 0) {
                this.offCtx.moveTo(padding - 5, y)
                this.offCtx.lineTo(padding, y)
                this.offCtx.stroke();
                this.offCtx.fillText(i > 9 ? i : '0' + i, padding - 30, y + 3);
                i += 59;

            }
        }
    }

    // 绘制折线
    drawLine(maxData) {
        const padding = 30;
        const width = this.offscreenCanvas.width - padding * 2;
        const height = this.offscreenCanvas.height - padding * 2;
        const stepX = width / (this.list.length - 1);
        const stepY = height / maxData;

        this.offCtx.beginPath();
        this.offCtx.moveTo(padding, this.offscreenCanvas.height - padding - (this.list[0].data * stepY));


        // 绘制折线
        this.list.forEach((point, i) => {
            const x = padding + i * stepX;
            const y = this.offscreenCanvas.height - padding - (point.data * stepY);
            this.offCtx.lineTo(x, y);
        });

        this.offCtx.strokeStyle = '#a22a2a'; // 折线颜色
        this.offCtx.lineWidth = 2;
        this.offCtx.stroke();
    }
    // 绘制数据点
    drawDataPoints(maxData) {
        const padding = 30;
        const width = this.offscreenCanvas.width - padding * 2;
        const height = this.offscreenCanvas.height - padding * 2;
        const stepX = width / (this.list.length - 1);
        const stepY = height / maxData;
        this.dataXY = []

        // 绘制每个数据点
        this.list.forEach((point, i) => {
            const x = padding + i * stepX;
            const y = this.offscreenCanvas.height - padding - (point.data * stepY);
            this.dataXY.push({ 'x': x, 'y': y })
            this.offCtx.beginPath();
            this.offCtx.arc(x, y, 2, 0, 2 * Math.PI);
            this.offCtx.fillStyle = '#a22a2a';
            this.offCtx.fill();
        });
        this.offCtx.fillStyle = '#000';

    }
    // 显示 Tooltip
    showTooltip(event) {
        const padding = 30;
        this.ctx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
        if (mouseX < padding || mouseY < padding / 2 || mouseX > this.canvas.width - padding / 2 || mouseY > this.canvas.height - padding) {
            this.ctx.drawImage(this.offscreenCanvas, 0, 0);
            this.tooltip.style.display = 'none';
            return;
        }
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        this.ctx.beginPath();
        this.ctx.moveTo(padding, mouseY);
        this.ctx.lineTo(this.offscreenCanvas.width - padding, mouseY);
        this.ctx.moveTo(mouseX, padding);
        this.ctx.lineTo(mouseX, this.offscreenCanvas.height - padding);
        this.ctx.strokeStyle = '#8a8a8a';
        this.ctx.stroke();
        this.dataXY.some((item, i) => {
            if (Math.floor(item.x / 10) == Math.floor(mouseX / 10)) {
                this.tooltip.style.display = 'block';
                this.tooltip.style.left = `${mouseX + 10}px`;
                this.tooltip.style.top = `${mouseY - 30}px`;
                this.tooltip.innerText = `${this.list[i].label}: ${this.list[i].data}h`;
                return true;
            } else {
                this.tooltip.style.display = 'none';
            }
        })
    }
    // 初始化绘制
    initChart(maxData) {
        this.offCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.ctx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.drawGrid(maxData);
        this.drawLine(maxData);
        this.drawDataPoints(maxData);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
    }
}


