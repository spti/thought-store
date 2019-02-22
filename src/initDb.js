const MongoClient = require('mongodb').MongoClient
// const schemas = require('./schema.js')

function initDbFactory() {
  const url = "mongodb://localhost:27017"
  const dbName = "thought-store"

  const textResource = {
    bsonType: "object",
    properties: {
      text: {
        bsonType: "string"
      }
    }
  }

  const urlResource = {
    bsonType: "object",
    properties: {
      url: {
        bsonType: "string"
      }
    }
  }

  const resources = {
    bsonType: "object",
    oneOf: [textResource, urlResource]
  }

  class InitDb {
    constructor(url, dbName) {
      this.client = new MongoClient(url)
      this.wireUp(this.client)

      .then((db) => {
        this.db = db
        return this.createResources(this.db)
      })
      .catch((err) => {
        console.log("InitDb.constructor, something gone wrong, err: ", err);
      })

    }

    wireUp(client) {
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
        return collection.createIndex({text: "text"})
      })
    }
  }

  return {
    schema: {textResource, urlResource, resources},
    initDb: new InitDb(url, dbName),
    url: url,
    dbName: dbName
  }
}

module.exports = {
  initDbFactory
}
