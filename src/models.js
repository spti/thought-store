
/*
  collections
    resources
    entities
    posts
    views
    edges
    edgeLabels

  in resources, the low-level data is stored (from entities)
  entities can reference resources, views and itself (reference views to specify how to display any given resource)
  entities don't have a model (docs in it can have different fields)

  posts reference entities

  an entity could be a piece of content
  it can combine other entities and resources, that together comprise another entity
  an entity can be simply a specification of how to display other entity or resource (there can be multiple ways of displayin one and the same entity/resource)
*/


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
    return db.createCollection("resources", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    }).then((collection) => {
      return collection.createIndex({text: "text"})
      .then(() => {
        return collection
      })
      // return collection
    })
  }
}

const entities = {
  schema: {
    bsonType: "object",
    properties: {
      _id: {bsonType: 'objectId'},
      refs: {
        bsonType: "array",
        items: {
          bsonType: "object",
          properties: {
            _id: {bsonType: "objectId"},
            // ref to resources, or entities
            ref: { bsonType: "objectId" },
            // ref to labels, or entities
            label: { bsonType: "objectId" }
          },
          required: ['_id', 'ref'],
          additionalProperties: false
        },
        additionalItems: false,
        minItems: 1
      },
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

  create: function(db) {
    return db.createCollection("labels", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    })
    .then((collection) => {
      return collection.createIndex({name: 1}, {unique: true})
      .then(() => {
        return collection
      })
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

module.exports = {entities, resources, views, labels}
