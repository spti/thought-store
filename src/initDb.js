const MongoClient = require('mongodb').MongoClient
// const ObjectId = require('mongodb').ObjectID
// const schemas = require('./schema.js')


class DbWrap {
  constructor(url, dbName, models, options) {
    options = options || {}
    this.devEnv = options.devEnv || false
    this.logs = []

    this.client = new MongoClient(url, options.clientOps || {})
    this.dbName = dbName

    this.init()
    .then((lastCreatedColl) => {
      this.log("created collections", lastCreatedColl)
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

      return this.createCollections(this.models.map(m => m))
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

  createCollections(models) {
    const model = models.shift()

    return model.create.call(model, this.db)
    .then((collection) => {
      this.log("created collection", collection)

      if (models.length > 0) {
        return this.createCollections(models)
      } else {
        return collection
      }
    })
  }

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}

module.exports = {
  DbWrap
}
