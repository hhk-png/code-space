const fs = require("fs")
const child_process = require('child_process')
const Koa = require('koa')

const app = new Koa()
app.use(async ctx => ctx.response.body = await run(ctx.request.path))
app.listen(3000)

async function run(path) {
    return new Promise((resolve, reject) => {
        const child = child_process.fork('./child.js')
        child.on('message', resolve)
        try {
            console.log(`.${path}.js`)
            const fn = fs.readFileSync(`./${path}.js`, { encoding: 'utf-8' })
            child.send({ action: 'run', fn })
        } catch(e) {
            if (e.code === 'ENOENT') {
                return resolve('Not Founf Function')
            }
            return reject(e.toString())
        }
        
    })
}
