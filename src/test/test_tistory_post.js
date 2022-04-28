
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
    const html = $(".tt_article_useless_p_margin").html();
     
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


