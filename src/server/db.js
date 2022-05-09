const db = require('mariadb');
require('dotenv').config();

// 설정된 환경으로 config 적용.

const db_cfg = 
{
    host: process.env.DB_HOST || 'localhost'
    , port:process.env.DB_PORT || 3306
    , user: process.env.DB_ID || 'tistory'
    , password: process.env.DB_PASSWORD || 'tistory'
    , database: "tistory"
    , connectionLimit: 5
}

const pool = db.createPool(db_cfg);

console.log(process.env, db_cfg);


async function query(sql){
    let conn, rows;
    try{
        conn = await pool.getConnection();
        console.log(pool, conn);
        rows = await conn.query(sql);
    }catch(err){
        rows = err;
        throw err;
    }finally{
        if (conn) conn.release();
        return rows;
    }
}

async function query2(sql){
    const result = await pool.query(sql);
    return result;
}
const test = async () =>{
    try{
        //console.log("start");
        row = await query2("select 1 as cnt");
        console.log(row);
    }catch(err){
        console.error("err", err);
    }finally{
        const endResult = await pool.end();
        console.log("endResult : ", endResult);
    }
    
}
//test();
module.exports.query = query;
module.exports.pool = pool;
