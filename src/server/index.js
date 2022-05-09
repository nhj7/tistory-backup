const fastify = require('fastify')({
    logger: true
})
const fastifyStatic = require('@fastify/static')
const path = require('path')

fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../static'),
  prefix: '/', // optional: default '/'
})

fastify.register(fastifyStatic, {
    root: path.join(__dirname, '../../target/'),
    prefix: '/target/',
    decorateReply: false // the reply decorator has been added by the first plugin registration
})

const db = require("./db.js")

fastify.get('/api/request-backup', async function (req, reply) {
    const backReqQry = `select 1 as cnt`
    const result = await db.pool.query(backReqQry);
    console.log(result, req);
    return `echo request-backup` // sending path.join(__dirname, 'public', 'myHtml.html') directly with custom filename
})

fastify.get('/api/request-list', function (req, reply) {
    return `echo request-list` // sending path.join(__dirname, 'public', 'myHtml.html') directly with custom filename
})


// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()