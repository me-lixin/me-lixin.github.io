let intervalId3;
let intervalId4;
let time;
function run3() {
    // const elapsed = Date.now() - start;
    time.s++;
    if (time.s == 60) {
        time.s = 0;
        time.m++;
    }
    if (time.m == 60) {
        time.m = 0;
        time.h++;
    }
    console.log('时间', `${time.h > 9 ? time.h : '0' + time.h}:${time.m > 9 ? time.m : '0' + time.m}:${time.s > 9 ? time.s : '0' + time.s}`);
}
function run4() {
    if (time.m2 == 0 && time.s2 == 0) {
        time.m2 = 60;
        time.h2--;
    }
    if (time.s2 == 0) {
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
        
    }else{
        clearInterval(intervalId3);
        clearInterval(intervalId4)
        console.log('后台计时器关闭');
        postMessage(time)
    }
    

};
function test(){
    console.log('我是后台线程中的方法');
    
}