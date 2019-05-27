const path = require("path")
const helpers = require('../src/helpers.js')
// const converter = require("../src/convert.js")


class Demo {
  constructor(options) {

    options = options || {}
    this.devEnv = options.devEnv || false
    this.logs = []
    this.parsedFiles = []
  }

  parseFile() {
    return helpers.parseFile(path.resolve(__dirname, 'demo-text_02-01.txt'))
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
