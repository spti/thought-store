const Db = require('./db.js')
const models = require('./models.js')
const CrudTree = require('./save-tree-to-db.js')
const helpers = require('../util/helpers.js')

// function instantiate() {
//   const url = "mongodb://localhost:27017"
//   const urlRs = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019"
//   const dbName = "thought-store"
//
//   return new TryThings(url, dbName,
//   {devEnv: true})
// }

const connectionData = {
  url: "mongodb://localhost:27017",
  urlRs: "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019",
  dbName: "thought-store",
}

class Umbrella {
  constructor() {
    this.db = new Db(connectionData.url, connectionData.dbName)
  }

  init() {
    this.db.init()
    .then((db) => {
      const entities = new models.Entities(this.db, {log: this.log.bind(this)})
      const resources = new models.Resources(this.db, {log: this.log.bind(this)})

      return entities.init()
      .then(() => {
        return resources.init()
      })
      .then(() => {
        this.crudTree = new CrudTree({entities, resource}, {})
      })
    })

    saveTree(body) {
      this.crudTree.saveTree(boy.tree, body.map)
      .then((result) => {
        // translate the thoughts into frontend readable form
        const thoughts = helpers.prettifyMap(result)
        return JSON.stringify(thoughts)
      })
    }
  }

}
