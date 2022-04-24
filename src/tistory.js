const axios = require("axios").default;
const cheerio = require("cheerio");

function sleep(t){
    console.log(t+"ms sleep.");
    return new Promise(resolve=>setTimeout(resolve,t));
}

//const tistoryUrl = 'https://nhj12311.tistory.com/';
let pageCnt = 1;
const getTistoryPosts = async (tistoryUrl) => {
    let tistoryPosts = [];
    let arrPost = [];
    do{
        try {
            if( pageCnt > 1){
                await sleep(1000);
            }
            const response = await axios.get(tistoryUrl+"?page="+(pageCnt++));    
            const $ = cheerio.load(response.data);
            arrPost = $(".link_post").toArray().map(
                (el, idx) => {
                    //console.log(el.attribs.href +" : "+ el.children[1]);
                    return { href : el.attribs.href, title : el.children[1].children[0].data };
                }
            )        
            console.error(arrPost);
            tistoryPosts = [ ...tistoryPosts, ...arrPost];
        } catch (error) {
            console.error("error : ",error);
            arrPost = [];    
        }
    }while( arrPost.length > 0)
    return tistoryPosts;
}

const getMarkdownByTistoryPost = async (tistoryPostUrl) => {
    const response = await axios.get(tistoryPostUrl);
    const $ = cheerio.load(response.data);
    // For Node.js
    const TurndownService = require('turndown');
    const turndownService = new TurndownService();
    turndownService.remove("script");
    $(".container_postbtn").remove();
    $("script").remove();
    const html = $(".tt_article_useless_p_margin").html();
     
    //console.log(html);

    const markdown = turndownService.turndown(html);
    
    return (markdown);
};


var fs = require('fs');

(async() =>{

    const tistoryUrl = `https://nhj12311.tistory.com/category/dev`;
    //const tistoryPosts = await getTistoryPosts('https://nhj12311.tistory.com/category/dev');
    const tistoryPosts = await getTistoryPosts(tistoryUrl);

    console.log('posts : '+tistoryPosts.length);


    for( const [ idx, post]  of tistoryPosts.entries()){
        console.log(idx,post);
        

        const markdown = await getMarkdownByTistoryPost(`https://nhj12311.tistory.com`+post.href);
        console.log("markdown",markdown);

        
        const gatsbyMarkdown = 
`---
title: '${post.title.replace(/'/gi,"\"")}'
date: 2022-04-22 16:21:13
category: 'dev'
draft: false
---

${markdown}
`;
        
        const fileName = "./target"+post.href.split("?")[0] + ".md";
        fs.writeFile(fileName,gatsbyMarkdown,"UTF8",function(err){ 
            if (err) throw err; 
            console.log('file write complete'); 
        });

        console.log("sleep 1000ms");
        await sleep(1000);
    }

    debugger; 
    
})();

/*
---
title:'Category Test1'
date:2020-07-02 16:21:13
category:'category1'
draft:false
---

Test1


*/






