const MongoClient = require('mongodb').MongoClient
const treeLib = require('./tree-lib.js')
const trees = require('./fake-trees.js')
// const ObjectId = require('mongodb').ObjectID
// const schemas = require('./schema.js')


class TestSaveTree {
  constructor(url, dbName, options) {
    options = options || {}
    this.devEnv = options.devEnv || false
    this.logs = []

    this.client = new MongoClient(url, options.clientOps || {})
    this.dbName = dbName

    this.init()
    .then((collection) => {
      this.log("created collections", collection)
      this.coll = collection
    })
    .catch((err) => {
      this.log("errored somewhere during init", err)
    })

  }

  init() {
    return this.client.connect()
    .then(() => {
      try {
        this.db = this.client.db(this.dbName)
      } catch(err) {
        return Promise.reject(err)
      }

      return this.db.createCollection("resources")
    })
  }

  createCollection() {
    return this.db.createCollection("resources")
  }

  drop() {
    if (this.db) {
      return this.db.dropDatabase()
    } else {
      return this.wireUp(this.client, this.dbName)
      .then((db) => {
        return db.dropDatabase()
      })
    }
  }

  setDepth() {

  }

  saveTree() {

  }

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}

function instantiateTest() {
  const url = "mongodb://localhost:27017"
  const urlRs = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019"
  const dbName = "test-save-tree"

  return new TestSaveTree(urlRs, dbName,
  {devEnv: true, clientOps: {}})
  // {devEnv: true, clientOps: {replicaSet: "rs"}})
}

module.exports = {
  test: instantiateTest()
}
