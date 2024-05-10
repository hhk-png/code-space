
function myPromise(executor) {
  let self = this;
  // Promise有三个状态
  // pending fulfilled rejected
  self.status = 'pending';
  // 接收成功的值
  self.value = undefined;
  // 接收失败的原因
  self.reason = undefined;
  self.onResolved = []; // 专门存放成功的回调
  self.onRejected = []; // 失败的回调

  // 成功时调用
  function resolve(value) {
    if (self.status === 'pending') {
      // 存储成功的结果
      self.value = value;
      // 改变状态
      self.status = 'fulfilled';
      // 】依此调用成功的回调
      self.onResolved.forEach(fn => fn());
    }
  }

  function reject(reason) {
    if (self.status === 'pending') {
      self.reason = reason;
      self.status = 'rejected';
      self.onRejected.forEach(fn => fn())
    }
  }

  try {
    // 目的函数
    executor(resolve, reject);
  } catch (e) {
    // 目的函数执行错误
    reject(e)
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  // console.log(1)
  // 防止循环调用
  if (promise2 === x) {
    return reject(new TypeError('循环调用'));
  }

  // x为对象或者函数
  if ((x !== null && typeof x === 'object') || typeof x === 'function') {
    try {
      let then = x.then;
      // 说明返回值x是一个Promise
      if (typeof then === 'function') {
        then.call(x, y => {
          resolvePromise(promise2, y, resolve, reject);
        }, (e) => {
          reject(e);
        })
        // 返回值不是Promise，但是是一个数组
      } else {
        resolve(x);
      }
    } catch (error) {
      reject(error);
    }
    // 返回值是一个普通数据
  } else {
    resolve(x);
  }
}

myPromise.prototype.then = function (onfulfilled, onrejected) {
  let self = this;
  let promise2;
  promise2 = new myPromise((resolve, reject) => {
    if (self.status === 'fulfilled') { // 状态为成功
      setTimeout(function () {
        try {
          let x = onfulfilled(self.value); // 执行成功的回调
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e)
        }
      }, 0)
    }
    if (self.status === 'rejected') { // 状态失败
      setTimeout(function () {
        try {
          let x = onrejected(self.reason); // 执行失败的回调
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e)
        }
      }, 0)
    }
    if (self.status === 'pending') { // 初始状态
      self.onResolved.push(function () { // 将成功回调函数填入数组中
        setTimeout(function () {
          try {
            let x = onfulfilled(self.value); // 执行成功的回调
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0)
      });
      self.onRejected.push(function () {
        setTimeout(function () {
          try {
            let x = onrejected(self.reason); // 执行失败的回调
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e)
          }
        }, 0)
      })
    }
  })

  return promise2;
  // return self;
}

myPromise.prototype.catch = function (errCallback) {
  return this.then(null, errCallback)
}

myPromise.defer = myPromise.deferred = function () {
  let dfd = {};
  dfd.promise = new myPromise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

// debugger
let p =
  new myPromise((resolve, reject) => {
    // console.log('1')
    setTimeout(() => {
      resolve(111);
    }, 1000)
  })
    .then(() => {
      return new Promise((resolve, reject) => {
        resolve(111)
      })
    }, (reason) => {
      console.log(reason);
    })
    .then((data) => {
      console.log('成功了', data)
    }, (reason) => {
      console.log(reason);
    })


