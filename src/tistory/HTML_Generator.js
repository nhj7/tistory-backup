
const index_html = (blogName) => {

const _index_html = 
`
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
<!-- NewPage -->
<html lang="ko">
<head>
<title>tistory backup - ${blogName}</title>
<script type="text/javascript">
    tmpTargetPage = "" + window.location.search;
    if (tmpTargetPage != "" && tmpTargetPage != "undefined")
        tmpTargetPage = tmpTargetPage.substring(1);
    if (tmpTargetPage.indexOf(":") != -1 || (tmpTargetPage != "" && !validURL(tmpTargetPage)))
        tmpTargetPage = "undefined";
    targetPage = tmpTargetPage;
    function validURL(url) {
        try {
            url = decodeURIComponent(url);
        }
        catch (error) {
            return false;
        }
        var pos = url.indexOf(".html");
        if (pos == -1 || pos != url.length - 5)
            return false;
        var allowNumber = false;
        var allowSep = false;
        var seenDot = false;
        for (var i = 0; i < url.length - 5; i++) {
            var ch = url.charAt(i);
            if ('a' <= ch && ch <= 'z' ||
                    'A' <= ch && ch <= 'Z' ||
                    ch == '$' ||
                    ch == '_' ||
                    ch.charCodeAt(0) > 127) {
                allowNumber = true;
                allowSep = true;
            } else if ('0' <= ch && ch <= '9'
                    || ch == '-') {
                if (!allowNumber)
                        return false;
            } else if (ch == '/' || ch == '.') {
                if (!allowSep)
                    return false;
                allowNumber = false;
                allowSep = false;
                if (ch == '.')
                        seenDot = true;
                if (ch == '/' && seenDot)
                        return false;
            } else {
                return false;
            }
        }
        return true;
    }
    function loadFrames() {
        if (targetPage != "" && targetPage != "undefined")
                top.postFrame.location = top.targetPage;
    }
</script>


<frameset cols="20%,80%" title="Documentation frame" onload="top.loadFrames()">
<frameset rows="30%,70%" title="Left frames" onload="top.loadFrames()">
<frame src="category-frame.html" name="categoryFrame" title="All Category">
<frame src="allposts-frame.html" name="postListFrame" title="All posts">
</frameset>
<frame src="" name="postFrame" title="" scrolling="yes">
<noframes>
<noscript>
<div>JavaScript is disabled on your browser.</div>
</noscript>
<h2>Frame Alert</h2>
<p>This document is designed to be viewed using the frames feature. If you see this message, you are using a non-frame-capable web client. Link to <a href="overview-summary.html">Non-frame version</a>.</p>
</noframes>
</frameset>
</html>
`

return _index_html;
}

const category_frame_html = (blogName, categoryMap) => {

    //categoryMap

    let category_list = ``
    let totCnt = 0;
    for (let entry of categoryMap.values()) { // the same as of recipeMap.entries() 
        
        if( entry.parent!="" ){
            continue;
            
        }
        const categoryName = entry.name;
        category_list += "" + `<li><a href="allposts-frame.html?categoryId=${entry.id}&categoryName=${entry.label}" target="postListFrame">${categoryName}(${entry.entries})</a></li>`   + "\n" ;
        totCnt+=parseInt(entry.entries);
        let chk_ol = false;
        for (let child of categoryMap.values()) {
            if( entry.id == child.parent ){
                if( !chk_ol ){
                    category_list += `<ol style="list-style-type: circle ; padding-bottom: 0;">\n\t`;
                    chk_ol = true;
                }
                category_list += "" + `<li><a href="allposts-frame.html?categoryId=${child.id}&categoryName=${child.label}" target="postListFrame">${child.name}(${child.entries})</a></li>`   + "\n" ;                
            }
        }
        if(chk_ol){
            category_list += `</ol>\n`;
        }
    }
    

    const _category_frame_html = 
`

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">
<head>
<title>Category List (${blogName})</title>
<body>
<h1 ><strong>${blogName} </strong></h1>
<div class="indexHeader"><span><a href="allposts-frame.html" target="postListFrame">전체&nbsp;글(${totCnt})</a></span></div>
<div class="indexContainer">
<h2 title="Packages">카테고리</h2>
<ul title="Packages" style="list-style-type: disc ; padding-bottom: 0;">

${category_list}

</ul>
</div>
<p>&nbsp;</p>
</body>
</html>


`
return _category_frame_html;

}

const allposts_frame_html = (blogName, categoryMap, tistoryPosts) => {

    let postList = ``;

    for( const [ idx, post]  of tistoryPosts.entries()){
        const categoryName = categoryMap.get(post.categoryId)?.name || '없음';
        const parentCategoryName = categoryMap.get(categoryMap.get(post.categoryId)?.parent)?.name || '';
        const urlPath = `./${parentCategoryName}/${categoryName}/${post.id}`
        
        postList += `<li data-category="${post.categoryId}" ><a href="${urlPath}/${post.id}.html" title="${post.title}" target="postFrame">${post.title}</a></li>`;
    }

    const afh = 
`

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">
<head>
<title>All Posts ( ${blogName} )</title>

<body>
<h1 id="bar" class="bar">All&nbsp;Posts</h1>
<div class="indexContainer">
<ul>

${postList}

</ul>
</div>
</body>
<script>
    const categoryId = new URL(location.href).searchParams.get('categoryId')
    const categoryName = new URL(location.href).searchParams.get('categoryName')
    const lis = document.querySelectorAll('li');
    if( categoryId ){
        for(li of lis) {
            if( li.dataset?.category != categoryId ){
                li.style.display = "none";
            }
            li.style.color = "red";
        }

        document.getElementById("bar").innerText = categoryName;
    }
    
</script>
</html>

`

return afh;
}

module.exports = {
    get_index_html : index_html
    , get_category_frame_html : category_frame_html
    , get_allposts_frame_html : allposts_frame_html
}

const categoryMap = new Map();
categoryMap.set("1", { name : "dev", parent : "" })
categoryMap.set("2", { name : "nodejs", parent : "1" })


//console.log(category_frame_html('nhj12311', categoryMap ));
