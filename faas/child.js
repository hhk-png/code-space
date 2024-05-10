const process = require('process')
const { VM } = require('vm2')

process.on('message', function (data) {
    const fnIIFE = `(${data.fn})()`
    const result = new VM().run(fnIIFE)
    process.send({ result })
    process.exit()
})

