const db = require("../db/db.js");
const cron = require('node-cron');

const sleep = (ms) => {
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

let isRunning = false;

const tistory = require("../tistory/tistory.js");
cron.schedule('0 */1 */1 * * *', async () => {
    try {
        console.log('tistory-backup batch run');
        if( isRunning ){
            console.log('isRunning exit');
            return;
        }
        isRunning = true;
        const reqSelQry = `select * from T_BACKUP_REQ where req_status = 0 order by seq asc limit 1`;
        const reqSelResult = await db.pool.query(reqSelQry);
        console.log('reqSelResult', reqSelResult);
        if( reqSelResult && reqSelResult.length > 0 )
        try {
            const reqUpQry = `update T_BACKUP_REQ set req_status = 3 where seq = ${reqSelResult[0].SEQ} `;
            const reqUpResult = await db.pool.query(reqUpQry);

            console.log('reqUpResult', reqUpResult);

            if( reqUpResult.affectedRows == 1){
                await tistory.backupTistoryBlog(reqSelResult[0].ID);

                const reqUp2Qry = `update T_BACKUP_REQ set req_status = 7 where seq = ${reqSelResult[0].SEQ} `;
                const reqUp2Result = await db.pool.query(reqUp2Qry);

                console.log('reqUp2Result', reqUp2Result);
                
            }else{

                const reqUp2Qry = `update T_BACKUP_REQ set req_status = 9, STATUS_MSG = 'reqUpResult.affectedRows = 0' where seq = ${reqSelResult[0].SEQ} `;
                const reqUp2Result = await db.pool.query(reqUp2Qry);
                console.log('reqUp2Result', reqUp2Result);

                
            }
        } catch (error) {            
            console.error('reqUpResult error', error);
            const reqUp2Qry = `update T_BACKUP_REQ set req_status = 9, STATUS_MSG = '${error.message}' where seq = ${reqSelResult[0].SEQ} `;
            const reqUp2Result = await db.pool.query(reqUp2Qry);
        }
        

    } catch (error) {
        console.error('error', error);
    }finally{
        isRunning = false;
    }
    
    
}

    , { timezone: "Asia/Seoul" }
);