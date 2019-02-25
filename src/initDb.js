const MongoClient = require('mongodb').MongoClient
// const ObjectId = require('mongodb').ObjectID
// const schemas = require('./schema.js')

const resources = {
  schema: {
    bsonType: "object",
    anyOf: [
      // text
      {
        bsonType: "object",
        properties: {
          _id: {
            bsonType: "objectId"
          },
          text: {
            bsonType: "string"
          }
        },
        required: ['_id', 'text'],
        additionalProperties: false
      },

      // url
      {
        bsonType: "object",
        properties: {
          _id: {
            bsonType: "objectId"
          },
          url: {
            bsonType: "string"
          }
        },
        required: ['_id', 'url'],
        additionalProperties: false
      }
    ]
  },
  create: function(db) {
    return db.createCollection("entities", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    }).then((collection) => {
      return collection.createIndex({text: "text"})
      // return collection
    })
  }
}

const entities = {
  schema: {
    bsonType: "object",
    properties: {
      _id: 'objectId',
      refs: [
        {
          // ref to resources, or entities
          ref: { bsonType: "objectId" },
          // ref to labels, or entities
          label: { bsonType: "objectId" }
        }
      ],
      view: {
        bsonType: "objectId"
      }
    },
    required: ['_id', 'refs'],
    additionalProperties: false
  },
  create: function(db) {
    return db.createCollection("entities", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    })
  }
}

const labels = {
  schema: {
    bsonType: "object",
    properties: {
      _id: {bsonType: "objectId"},
      name: { bsonType: "string" }
    },
    required: ['_id', 'name'],
    additionalProperties: false,
  },

  createCollection: function(db) {
    return db.createCollection("labels", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    })
    .then((collection) => {
      return collection.createIndex({name: 1}, {unique: true})
    })
  }
}

const views = {
  schema: {
    bsonType: "objectId",
    properties: {
      _id: {
        bsonType: "string"
      },
      url: {
        bsonType: "string"
      }
    },
    required: ['_id', 'url'],
    additionalProperties: false
  },
  create: function(db) {
    return db.createCollection("views", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    })
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
