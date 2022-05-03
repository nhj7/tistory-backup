const axios = require("axios").default;
const cheerio = require("cheerio");
const webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const TurndownService = require('turndown');
const turndownService = new TurndownService();
turndownService.remove("script");
turndownService.keep(['table','figure'])

const fs = require('fs/promises');
const path = require('path');

require("dotenv").config();

const htmlGen = require("./tistory/HTML_Generator.js")

function sleep(t){
    console.log(t+"ms sleep.");
    return new Promise(resolve=>setTimeout(resolve,t));
}

async function isExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
};
  
async function writeFile(filePath, data) {
    try {
        const dirname = path.dirname(filePath);
        const exist = await isExists(dirname);
        if (!exist) {
        await fs.mkdir(dirname, {recursive: true});
        }
        
        await fs.writeFile(filePath, data, 'utf8');
    } catch (err) {
        throw new Error(err);
    }
}

(async () => {

    // get tistory api access_token oauth 2.0
    let access_token = '';    
    {

        const chromeOptions   = new chrome.Options();
        chromeOptions.addArguments('--headless');

        // 1. chromedriver 경로 설정 // chromedriver가 있는 경로를 입력 
        const service = new chrome.ServiceBuilder('./chromedriver/win32/chromedriver.exe').build(); 
        chrome.setDefaultService(service);     
        // 2. chrome 브라우저 빌드 
        const driver = await new webdriver.Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
        
        await driver.manage().setTimeouts({ 
            implicit: 10000, // 10초 
            pageLoad: 30000, // 30초 
            script: 30000, // 30초 
        });

        //console.log(process.env.client_id);

        const reqUrl = `https://www.tistory.com/oauth/authorize?client_id=${process.env.client_id}&redirect_uri=http://localhost&response_type=code`;
        
        // 3. 사이트 열기 
        await driver.get(reqUrl); 

        //console.log(By);

        // kakao login click
        await driver.findElement(By.className("link_kakao_id")).click();
        
        // input id, pwd
        await driver.findElement(By.name("email")).sendKeys(process.env.kakao_id);
        await driver.findElement(By.name("password")).sendKeys(process.env.kakao_pwd);
        
        // confirm click
        await driver.findElement(By.className("btn_confirm")).click();
        await driver.findElement(By.className("confirm")).click();
        
        const curUrl = await driver.getCurrentUrl();
        const _params = curUrl.split("?")[1];
        const params = Object.fromEntries(new URLSearchParams(_params));
        console.log(curUrl, _params, params);
        if( params.code == undefined ){
            console.error("params.code is undefined");
            return;
        }
        const authCode = params.code;
        await driver.quit();

        const getAccessTokenUrl = `https://www.tistory.com/oauth/access_token?client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&redirect_uri=http://localhost&code=${authCode }&grant_type=authorization_code`

        //await driver.get(getAccessTokenUrl); 
        const _access_token = await axios.get(getAccessTokenUrl);
        console.log(_access_token);
        if( _access_token.data.access_token == undefined ){
            console.error("_access_token.data.access_token is undefined");
            return;
        }
        access_token = _access_token.data.access_token;
    }
    

    const blogName = 'nhj12311';

    await writeFile(`./target/${blogName}/index.html`,htmlGen.get_index_html(blogName));    // make index.html


    


    const categoryUrl = `https://www.tistory.com/apis/category/list?access_token=${access_token}&output=json&blogName=${blogName}`;
    const categoryRes = await axios.get(categoryUrl);
    const categories = categoryRes.data.tistory.item.categories;
    console.log(categoryRes);
    const categoryMap = categories.reduce((map, obj) => { map.set(obj.id, obj); return map; }, new Map); 
    console.log(categoryMap);

    await writeFile(`./target/${blogName}/category-frame.html`,htmlGen.get_category_frame_html(blogName, categoryMap)); // make category frame

    let page_number = 1;
    let listRes = {};
    let tistoryPosts = [];
    do {
        const listUrl = `https://www.tistory.com/apis/post/list?access_token=${access_token}&output=json&blogName=${blogName}&page=${page_number++}`
        listRes = await axios.get(listUrl);
        console.log(listRes.data.tistory.item.posts);
        if( listRes.data.tistory.item.posts != undefined ){
            tistoryPosts = [ ...tistoryPosts, ...listRes.data.tistory.item.posts];
        }
    } while (listRes.data.tistory.item.posts != undefined);

    // make allposts-frame.html
    await writeFile(`./target/${blogName}/allposts-frame.html`,htmlGen.get_allposts_frame_html(blogName, categoryMap, tistoryPosts)); // make all posts frame.

    for( const [ idx, post]  of tistoryPosts.entries()){
        console.log(idx,post);

        if( categoryMap.get(post.categoryId).label.indexOf("dev") == -1){
            continue;
        }

        const categoryName = categoryMap.get(post.categoryId)?.name || '없음';
        const parentCategoryName = categoryMap.get(categoryMap.get(post.categoryId)?.parent)?.name || '';
        const readUrl = `https://www.tistory.com/apis/post/read?blogName=${blogName}&postId=${post.id}&access_token=${access_token}&output=json`;
        
        const readRes = await axios.get(readUrl);

        const $ = cheerio.load(readRes.data.tistory.item.content);

        const filePath = `./target/${blogName}/${parentCategoryName}/${categoryName}/${post.id}`
        
        

        // download post images
        {
            const arrImg = $("img");
            for(let i = 0; i < arrImg.length;i++){
                const el = arrImg[i];
                console.log(i, el);
                try {
                    const resImg = await axios({
                        method : 'GET',
                        url : el.attribs.src,
                        responseType: 'stream',
                    });
                    console.log(i, el, path.extname(el.attribs.src),resImg);
                    await writeFile(`${filePath}/${i}${path.extname(el.attribs.src).split("?")[0]}`, resImg.data);            
                } catch (error) {
                    console.error(error, i, el);
                }
            }

            $("img").replaceWith((i, el) => {
                console.log(i, el);
        
                // const resImg = await axios({
                //     method : 'GET',
                //     url : el.attribs.src,
                //     responseType: 'stream',
                // });
                // console.log(i, el, path.extname(el.attribs.src),resImg);
                const imgFileName = `./${i}${path.extname(el.attribs.src)}`;
                // await writeFile(`./target/${imgFileName}`, resImg.data);
        
                return $(el).attr('src', `${imgFileName}`)
            });
        }
        

        const markdown = turndownService.turndown($.html());
        console.log(markdown);

        const gatsbyMarkdown = 
`---
title: '${post.title.replace(/'/gi,"\"")}'
date: ${post.date}
category: '${categoryName}'
draft: false
---

${markdown}
`;
        
        const markdownFileName = `${filePath}/${post.id}.md`;
        const htmlFileName = `${filePath}/${post.id}.html`;
        await writeFile(markdownFileName,gatsbyMarkdown);

        $("body").prepend(`<p><h4 style='text-align:center;' >#${categoryName}</h4> <h1 style='text-align:center;'> ${post.title} </h1> </center> </p> <p style='text-align:right;' > ${post.date} </p> <br /> <hr /> <br />`)

        await writeFile(htmlFileName,$.html());
    } // end for( const [ idx, post]  of tistoryPosts.entries()){ 
    
    

    
    

    console.log("debugger");
})();