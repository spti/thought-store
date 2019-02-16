const path = require("path")
const fs = require("fs").promises
const parser = require("thought-store_syntax-parser")
const converter = require("../src/convert.js")

function readAndParse() {

  return fs.readFile(path.resolve(__dirname, 'demo-text_01.txt'), {encoding: 'utf8'})
  .then((fileStr) => {
    console.log("file contents: ", fileStr)
    const syntaxTree = parser.parse(fileStr)

    converter.convert(syntaxTree[0])
    return syntaxTree[0]
  })
  .catch(err => console.log('err on reading file', err))
}

// readTheFuckingFile()
module.exports = {readAndParse}
