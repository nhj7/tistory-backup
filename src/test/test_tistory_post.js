const nhm = require('node-html-markdown');

const axios = require("axios").default;
const cheerio = require("cheerio");

(async () => {
    const response = await axios.get(`https://nhj12311.tistory.com/575`);
    const $ = cheerio.load(response.data);
    // For Node.js
    const TurndownService = require('turndown');
    const turndownService = new TurndownService();
    turndownService.remove("script");
    turndownService.keep(['table'])

    // Import plugins from turndown-plugin-gfm
    var turndownPluginGfm = require('turndown-plugin-gfm')
    var gfm = turndownPluginGfm.gfm
    var tables = turndownPluginGfm.tables
    var strikethrough = turndownPluginGfm.strikethrough

    // Use the gfm plugin
    //turndownService.use(gfm)

    // Use the table and strikethrough plugins only
    //turndownService.use([tables])


    $(".container_postbtn").remove();
    //$("script").remove();
    const html = $(".tt_article_useless_p_margin").html();
     
    console.log(html);

    const markdown = turndownService.turndown(html);
    
    //console.log(markdown);


    const markdown2 = nhm.NodeHtmlMarkdown.translate(
        /* html */ html, 
        /* options (optional) */ {}, 
        /* customTranslators (optional) */ undefined,
        /* customCodeBlockTranslators (optional) */ undefined
    );
    console.log(markdown2);
    


    console.log("");
})();


