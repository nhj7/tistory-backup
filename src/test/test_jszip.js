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
    var JSZip = require("jszip");

    var zip = new JSZip();

    // create a file
    zip.file("hello.txt", "Hello[p my)6cxsw2q");
    // oops, cat on keyboard. Fixing !
    zip.file("hello.txt", "Hello World\n");

    // create a file and a folder
    zip.file("nested/hello.txt", "Hello World\n");
    // same as
    zip.folder("nested").file("hello.txt", "Hello World\n");

    var zipfile = null;
    if (JSZip.support.uint8array) {
        zipfile = await zip.generateAsync({type : "uint8array"});
    } else {
        zipfile = await zip.generateAsync({type : "string"});
    }

    console.log(zipfile);

    await writeFile(`test.zip`, zipfile);   


})()

