const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const url = "mongodb://localhost:27017"
const urlRs = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019"
const dbName = "test-db"

class Test {
  constructor(url, dbName, options) {
    options = options || {}
    this.devEnv = options.devEnv || false
    this.logs = []

    this.client = new MongoClient(url, options.clientOps || {})
    this.dbName = dbName
    // this.resourcesSchema = resourcesSchema
  }

  init() {
    return this.wireUp(this.client, this.dbName)

    .then((db) => {
      this.log('created db:', db)

      this.db = db
      return this.createCollection(this.db)
      .then((collection) => {
        this.log("created collection:", collection)
        return this
      })
    })
  }

  wireUp(client, dbName) {
    return client.connect()
    .then((client) => {
      const db = client.db(dbName)
      return db
    })
  }

  createCollection(db) {
    return db.createCollection("test-collection", {
      // validator: {
      //   $jsonSchema: resources
      // }
    }).then((collection) => {
      // return collection.createIndex({text: "text"})
      return collection
    })
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

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}

const test = new Test(urlRs, dbName, {devEnv: true, clientOps: {replicaSet: "rs"}})

function run() {
  return test.init()
}

module.exports = {test, run}
