

// const vm = require('vm')
// // const sandbox = Object.create(null)
// // vm.createContext(sandbox)
// console.log(this.prototype)
// vm.runInNewContext('this.constructor.constructor("return process")().exit()')
// // vm.runInContext('console.log(this)', sandbox)

// console.log('Never gets executed.')

const Koa = require('koa')
const app = new Koa()
app.use(async ctx => ctx.response.body = 'Hello world')

app.listen(3000)
