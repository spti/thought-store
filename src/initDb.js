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

const entities = {
  bsonType: "object",
}

const labels = {
  bsonType: "object",
  properties: {
    name: { bsonType: "string" }
  },
  additionalProperties: false
}

/*
const labels = {
  schema: {
    bsonType: "object",
    properties: {
      name: { bsonType: "string" }
    },
    additionalProperties: false
  },

  createCollection: function(db) {
    return db.createCollection("labels", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    })
    .then((collection) => {
      collection.createIndex({})
    })
  }
}
*/

const edges = {
  bsonType: "object",
  properties: {
    _id: {
      bsonType: "objectId"
    },
    head: {
      bsonType: "objectId"
    },
    tail: {
      bsonType: "objectId"
    },
    // label can be an entity (and an entity can be a reference to a labels collection, but doesnt have to)
    label: {
      bsonType: "objectId"
    }
  }
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
      return collection.createIndex({text: "text"})
      // return collection
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
