const express = require('express')
const Dev = require('./dev.js')
const helpers = require('../util/helpers.js')

const Db = require('./db.js')
const models = require('./models.js')
const CrudTree = require('./save-tree-to-db.js')

const router = require('./express-router.js')

const connectionData = {
  url: "mongodb://localhost:27017",
  urlRs: "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019",
  dbName: "thought-store",
}

class Main extends Dev {
  constructor(dbData, options) {
    super((options.devEnv) ? options.devEnv : false)

    this.dbUrl = dbData.url
    this.dbName = dbData.name

    this.httpPort = '3000'
    this.rootRoute = '/'
  }

  /*
  init() {
    return this.db.init()
    .then((db) => {
      const entities = new models.Entities(this.db, {log: this.log.bind(this)})
      const resources = new models.Resources(this.db, {log: this.log.bind(this)})

      return entities.init()
      .then(() => {
        return resources.init()
      })
      .then(() => {
        const crudTree = new CrudTree({entities, resources}, {devEnv: true})
        this.api = new ThoughtsApi(crudTree)
        return undefined
      })
      .then(() => {
        const server = express()
        const router = router.makeTheRouter(this.api, {log: this.log.bind(this)})
        server.use(this.rootRoute, router)
      })
    })
  }
  */

  init() {
    this.initDb(this.dbUrl, this.dbName)
    .then((db) => {
      this.db = db
      return this.initCrudTree(this.db, models)
    })
    .then((crudTree) => {
      this.crudTree = crudTree
      var api = null

      try {
        api = new ThoughtsApi(this.crudTree)
      } catch (err) {
        Promise.reject(err)
      }

      return api
    })
    .then((api) => {
      this.api = api
      return this.initServerAndRouter(this.httpPort, this.rootRoute)
    })
    .then((server) => {
      this.server = server
      return this
    })
  }

  initDb(url, name) {
    const db = new Db(url, name)
    return db.init()
  }

  initCrudTree(db, models) {
    const entities = new models.Entities(this.db, {log: this.log.bind(this)})
    const resources = new models.Resources(this.db, {log: this.log.bind(this)})

    return entities.init()
    .then(() => {
      return resources.init()
    })
    .then(() => {
      const crudTree = new CrudTree({entities, resources}, {devEnv: true})
      return crudTree
    })
  }

  initApi(crudTree) {
    return new ThoughtsApi(crudTree)
  }

  initServerAndRouter(port, rootRoute) {
    const server = express()
    const router = router.makeTheRouter(this.api, {log: this.log.bind(this)})
    server.use(rootRoute, router)
    server.listen(port)

    return server
  }
}

const main = new Main(
  {
    url: connectionData.url,
    name: connectionData.dbName
  },
  {devEnv: true}
)

main.init()
.then((main) => {
  main.log('main initialized', main)
})
.catch((err) => {
  main.log('error during main.init', err)
})
