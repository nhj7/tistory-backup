const nhm = require('node-html-markdown');


/* ********************************************************* *
 * Single use
 * If using it once, you can use the static method
 * ********************************************************* */

// Single file
const a = nhm.NodeHtmlMarkdown.translate(
  /* html */ `<b>hello111111111</b>`, 
  /* options (optional) */ {}, 
  /* customTranslators (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined
);



// Multiple files
nhm.NodeHtmlMarkdown.translate(
  /* FileCollection */ { 
    'file1.html': `<b>hello</b>`, 
    'file2.html': `<b>goodbye</b>` 
  }, 
  /* options (optional) */ {}, 
  /* customTranslators (optional) */ undefined,
  /* customCodeBlockTranslators (optional) */ undefined
);

console.log("111", a);
console.log("111");
console.log("111");
console.log("111");