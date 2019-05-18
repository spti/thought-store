const MongoClient = require('mongodb').MongoClient
const express = require('express')
const Dev = require('../dev.js')
const helpers = require('../util/helpers.js')

const models = require('./models.js')
const CrudTree = require('./crud-tree.js')
// const CrudTreeTest = require('./crud-tree.js')

const router = require('./api-routes.js')

const connectionData = {
  url: "mongodb://localhost:27017",
  urlRs: "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019",
  dbName: "thought-store",
}

class Main extends Dev {
  constructor(dbData, options) {
    super((options.devEnv) ? options.devEnv : false)
    this.options = options || {}

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
    .then((result) => {
      this.mongoClient = result.client
      this.db = result.db
      return this.initCrudTree(this.db, models)
    })
    .then((result) => {
      this.crudTree = result.crudTree
      this.crudTreeTest = result.crudTreeTest
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

  initDb(url, name, clientOps) {
    const client = new MongoClient(url, options.clientOps || {})
    return client.connect()
    .then(() => {
      var db = null

      try {
        db = client.db(name)
      } catch(err) {
        return Promise.reject(err)
      }

      return {client, db}
    })

    // const db = new Db(url, name)
    // return db.init()
  }

  initCrudTree(db, models) {
    const entities = new models.Entities(this.db, {log: this.log.bind(this)})
    const resources = new models.Resources(this.db, {log: this.log.bind(this)})

    return entities.init()
    .then(() => {
      return resources.init()
    })
    .then(() => {
      var crudTree = null
      var crudTreeTest = null
      try {
        crudTree = new CrudTree({entities, resources}, {devEnv: true})
        // crudTreeTest = new CrudTreeTest(crudTree, {devEnv: true})
      } catch (err) {
        Promise.reject(err)
      }

      return { crudTree } // , crudTreeTest
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

module.exports = function() {
  return main.init()
  .then((main) => {
    main.log('main initialized', main)
    return main
  })
  .catch((err) => {
    main.log('error during main.init', err)
  })
}
