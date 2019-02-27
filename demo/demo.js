const path = require("path")
const fs = require("fs").promises
const parser = require("thought-store_syntax-parser")
// const converter = require("../src/convert.js")


class Demo {
  constructor(options) {

    options = options || {}
    this.devEnv = options.devEnv || false
    this.logs = []
    this.parsedFiles = []
  }

  parseFile() {

    return fs.readFile(path.resolve(__dirname, 'demo-text_02-01.txt'), {encoding: 'utf8'})
    .then((fileStr) => {
      console.log("file contents: ", fileStr)

      return parser.parse(fileStr)

      // return converter.format(syntaxTree[0])
      // return syntaxTree[0]
    })
  }

  run() {
    this.parseFile()
    .then((parser) => {
      this.log("parsed the file, parser", parser)
      this.parsedFiles.unshift(parser.results)
    })
    .catch((err) => {
      this.log("something got fucked up,", err)
    })
  }

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}

// readTheFuckingFile()
module.exports = {demo: new Demo({devEnv: true})}
