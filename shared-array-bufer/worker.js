/* WORKER THREAD */

let BYTE_PER_LENTH = 5;
// 监听消息，并解析出data
addEventListener("message", ({data}) => {
  // 创建接口
  let arr = new Int16Array(data);
  console.group('[the worker thread]');
  console.log("Data received from the main thread: %i", arr[0]);
  console.groupEnd();

  // 修改数据
  let dataChanged = 5 * BYTE_PER_LENTH;
  arr[0] = dataChanged;
  
  // 发送
  postMessage("Updated");

  // 在主线程中typedArr的值也会被修改
})

