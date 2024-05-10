const cluster = require('cluster')
const fs = require('fs')
const Koa = require('koa')
const numCPUs = require('os').cpus().length
const {VM} = require('vm2')
// console.log(numCPUs)

if (cluster.isMater) {
    console.log(`Master ${process.pid} is running`)

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    // cluster.on('exit', (worker, code, signal) => {
    //     console.log(`worker ${worker.process.pid} died`)
    // })

} else {
    const app = new Koa()
    app.use(async ctx => ctx.response.body = await run(ctx.request.path))
    app.listen(3000)
}

async function run(path) {
    try {
        const fn = fs.readFileSync(`./${path}.js`, {encoding: 'utf-8'})
        const fnIIFE = `(${fn})()`
        return new VM().run(fnIIFE)
    } catch(e) {
        if (e.code === 'ENOENT') {
            return "Not Found Function"
        }
        return e.toString()
    }
}



