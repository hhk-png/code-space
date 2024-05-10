/* MAIN THREAD */


// 创建webworker
const newWorker = new Worker("./worker.js");
// 分配内存
const buffMemLength = new SharedArrayBuffer(1024);
// 创建一个操作已分配内存的接口
let typedArr = new Int16Array(buffMemLength);
// 赋值
typedArr[0] = 20;
// 向webworker发送数据
newWorker.postMessage(buffMemLength);

// 主线程收到信息的回调
newWorker.onmessage = (e) => {
  console.group('[the main thread]');
  console.log('Data updated from the worker thread: %i', typedArr[0]);
  console.groupEnd();
}



