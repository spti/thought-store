
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

const ObjectId = require('mongodb').ObjectID

const resourcesSchema = {
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
}

class Resources {
  constructor(db) {
    this.schema = resourcesSchema
    this.db = db
  }

  create() {
    return this.db.createCollection("resources", {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    }).then((collection) => {
      return collection.createIndex({text: "text"})
      .then(() => {
        this.collection = collection
        return this
      })
      // return collection
    })
  }

  saveOneText(text) {
    return this.collection.insertOne({
      text: text,
      _id: new ObjectId()
    })
  }
}

const entitiesSchema = {
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
          coll: { bsonType: "string", /*enum: ['resources', 'entities']*/ },
          to: { bsonType: "objectId" },
        },
        required: ['_id', 'coll', 'to'],
        additionalProperties: false
      },
      additionalItems: false,
      minItems: 1
    },
    // view: {
    //   bsonType: "objectId"
    // }
  },
  required: ['_id', 'refs'],
  additionalProperties: false
}

class Entities {
  constructor(db) {
    this.name = "entities"
    this.schema = entitiesSchema
    this.db = db
  }

  create() {
    return this.db.createCollection(this.name, {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    })
    .then((coll) => {
      this.collection = coll
      return this
    })
  }

  createRef(referee, collName, terminal) {
    return {
      to: referee._id,
      coll: collName,
      _id: new ObjectId()
      // terminal: referee.terminal || false
    }
  }

  saveOne(refs) {

    return this.collection.insertOne({
      _id: new ObjectId(),
      refs: refs
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

module.exports = {Entities, Resources, views, labels}
