const MongoClient = require('mongodb').MongoClient
// const ObjectId = require('mongodb').ObjectID
// const schemas = require('./schema.js')

// function initDbFactory() {
//
//   return {
//     schema: {textResource, urlResource, resources},
//     initDb: new DbWrap(url, dbName),
//     url: url,
//     dbName: dbName
//   }
// }

const textResource = {
  bsonType: "object",
  properties: {
    _id: {
      bsonType: "objectId"
    },
    text: {
      bsonType: "string"
    }
  },
  additionalProperties: false
}

const urlResource = {
  bsonType: "object",
  properties: {
    _id: {
      bsonType: "objectId"
    },
    url: {
      bsonType: "string"
    }
  },
  additionalProperties: false
}

const resources = {
  bsonType: "object",
  anyOf: [textResource, urlResource]
}

class DbWrap {
  constructor(url, dbName) {
    this.client = new MongoClient(url)
    this.dbName = dbName
    // this.resourcesSchema = resourcesSchema
  }

  init() {
    return this.wireUp(this.client, this.dbName)

    .then((db) => {
      this.db = db
      return this.createResources(this.db)
      .then((result) => {
        return this
      })
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

  wireUp(client, dbName) {
    return client.connect()
    .then((client) => {
      const db = client.db(dbName)
      return db
    })
  }

  createResources(db) {
    return db.createCollection("resources", {
      validator: {
        $jsonSchema: resources
      }
    }).then((collection) => {
      // return collection.createIndex({text: "text"})
      return collection
    })
  }
}

function instantiateDbWrap() {
  const url = "mongodb://localhost:27017"
  const dbName = "thought-store"

  return new DbWrap(url, dbName)
}

module.exports = {
  instantiateDbWrap
}
