
console.log(process.env.NODE_TLS_REJECT_UNAUTHORIZED);


const nhm = require('node-html-markdown');

const axios = require("axios").default;
const cheerio = require("cheerio");
const fs = require('fs/promises');
const path = require('path');

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

const url = require("url");

(async () => {
    const response = await axios.get(`https://nhj12311.tistory.com/575`);
    const $ = cheerio.load(response.data);
    // For Node.js
    const TurndownService = require('turndown');
    const turndownService = new TurndownService();
    turndownService.remove("script");
    //turndownService.remove("figure");
    
    turndownService.keep(['table','figure'])

    // Import plugins from turndown-plugin-gfm
    var turndownPluginGfm = require('turndown-plugin-gfm')
    var gfm = turndownPluginGfm.gfm
    var tables = turndownPluginGfm.tables
    var strikethrough = turndownPluginGfm.strikethrough

    // Use the gfm plugin
    //turndownService.use(gfm)

    // Use the table and strikethrough plugins only
    turndownService.use([tables])


    $(".container_postbtn").remove();
    //$("script").remove();
    const _html = $(".tt_article_useless_p_margin").html();
    
    const $html = cheerio.load(_html);

    const style1 = $("link");
    const arrCSS = [];
    for(let i = 0; i < style1.length;i++){        
        const el = style1[i];
        console.log(i, el);
        if( el.attribs.rel != 'stylesheet' ){
            console.log("style1 not stylesheet");
            continue;
        }
        try {

            const style1Url = (el.attribs.href.startsWith("//")?'http:':'') + el.attribs.href;
            const resStyle1 = await axios({
                method : 'GET',
                url : style1Url,
                responseType: 'stream',
            });
    
            const parsed = url.parse(style1Url);
            const style1FileName = `${i} - ${path.basename(parsed.pathname)}`;
            console.log(style1FileName);
            arrCSS.push(style1FileName);
            $html('head').append(`<link rel="stylesheet" href="./${style1FileName}">`);
            await writeFile(`./target/${style1FileName}`, resStyle1.data);
        } catch (error) {
            console.error(error, el.attribs.href);            
        }
        
    }


    const arrImg = $html("img");
    console.log(arrImg);

    for(let i = 0; i < arrImg.length;i++){
        const el = arrImg[i];
        console.log(i, el);
        const resImg = await axios({
            method : 'GET',
            url : el.attribs.src,
            responseType: 'stream',
        });
        console.log(i, el, path.extname(el.attribs.src),resImg);
        await writeFile(`./target/${i}.${path.extname(el.attribs.src)}`, resImg.data);        
    }

    $html("img").replaceWith((i, el) => {
        console.log(i, el);

        // const resImg = await axios({
        //     method : 'GET',
        //     url : el.attribs.src,
        //     responseType: 'stream',
        // });
        // console.log(i, el, path.extname(el.attribs.src),resImg);
        const imgFileName = `./${i}${path.extname(el.attribs.src)}`;
        // await writeFile(`./target/${imgFileName}`, resImg.data);

        return $html(el).attr('src', `${imgFileName}`)
    });

    console.log($html.html());


    $html("body").prepend(`<p> <h1>${'Log4J(Log4Shell) 역대 최악 보안 취약점(CVE-2021-44228)'} </h1> </p><br /><br />`)

    const html = $html.html();



    console.log("");

    console.log(html);

    await writeFile("./target/html.html", html);

    const markdown = turndownService.turndown(html);
    
    console.log(markdown);

    await writeFile("./target/turndown.md", markdown);


    const markdown2 = nhm.NodeHtmlMarkdown.translate(
        /* html */ html, 
        /* options (optional) */ {}, 
        /* customTranslators (optional) */ undefined,
        /* customCodeBlockTranslators (optional) */ undefined
    );
    console.log(markdown2);
    await writeFile("./target/NodeHtmlMarkdown.md", markdown2);


    console.log("");
})();


