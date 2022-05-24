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

const db = require("../db/db.js")

fastify.post('/api/request-backup', async (req, reply) => {
    try{
        const dupChkQry = `select id from T_BACKUP_REQ where id = ? and req_status in (0, 3) `;
        const dupResult = await db.pool.query(dupChkQry, [req.body.id]);
        if( dupResult.length > 0 ){
            return {code : 9, msg : `요청 중인 동일 아이디가 있습니다. [${req.body.id}]`}
        }
        console.log(dupResult, req);

        const backReqQry = `insert into T_BACKUP_REQ(id) values(?)`
        const result = await db.pool.query(backReqQry, [req.body.id]);
        console.log(result, req);
        const code = result.affectedRows == 1 ? 0 : 9;
        const msg = code == 0 ? `sucess backup request` : `error backup request`;
        return {code : code, msg : msg} // sending path.join(__dirname, 'public', 'myHtml.html') directly with custom filename
    }catch(e){
        console.error(e);
        return {code : 9, msg : e.message}
    }
    
})

fastify.get('/api/request-list', async (req, reply) => {
    try{
        const selBackupReqQry = `select * from T_BACKUP_REQ order by seq desc `;
        const selResult = await db.pool.query(selBackupReqQry);
        return {code : 0, msg : '정상', list : selResult} // sending path.join(__dirname, 'public', 'myHtml.html') directly with custom filename
    }catch(e){
        console.error(e);
        return {code : 9, msg : e.message}
    }

    //return `echo request-list` // sending path.join(__dirname, 'public', 'myHtml.html') directly with custom filename
})


// Run the server!
const start = async () => {
    console.log("...");
    try {
        await fastify.listen( process.env.WEB_PORT || 3000, '0.0.0.0' )
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()