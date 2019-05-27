const express = require('express')
const router = require('./express-router.js')
// const saver = require('./save-tree-to-db.js')
const Dev = require('./dev.js')
const mediator = require('./mediator.js')

console.log(router)
class ExpressServer extends Dev {
  constructor(options) {
    super((options.devEnv) ? options.devEnv : false)

    this.options = options || {}

    this.init()
    // .then(() => {
    //   this.log("created collections", lastCreatedColl)
    // })
    // .catch((err) => {
    //   this.log("errored somewhere during init", err)
    // })

  }

  init() {
    // console.log(router)
    const server = express()
    const router = this.options.routerFactory.makeTheRouter(
      {
        onRequest: (data) => {
          // this.saver.saveTree(data.tree, data.maps)
        },
        log: this.log.bind(this)
      }
    )

    this.saver = router.saver
    server.use('/', router.router)

    server.listen('3000')
    // this.server = server
  }

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}

const server = new ExpressServer({devEnv: true, routerFactory: router})
module.exports = server
