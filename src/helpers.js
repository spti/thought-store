const fs = require("fs").promises
const parser = require("thought-store_syntax-parser")

function parseFile(url) {

  return fs.readFile(url, {encoding: 'utf8'})
  .then((fileStr) => {
    console.log("file contents: ", fileStr)

    return parser.parse(fileStr)

    // return converter.format(syntaxTree[0])
    // return syntaxTree[0]
  })
}

module.exports = {parseFile}
