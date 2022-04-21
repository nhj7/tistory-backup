// For Node.js
var TurndownService = require('turndown')

var turndownService = new TurndownService()
var markdown = turndownService.turndown('<p><h1>Hello world!</h1></p>')

console.log(markdown);