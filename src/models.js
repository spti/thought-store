
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

function resourceFactory(coll) {
  return class {
    constructor(text, options) {
      options = options || {}

      this.type = 'resource'
      this.collection = coll

      this._id = options.id || new ObjectId()
      // this.id = this._id.toHexString()
      this.text = text
    }

    save() {
      return this.collection.insertOne({
        _id: this._id,
        text: this.text
      })
      .then((result) => {
        if (result.insertedCount != 1) return Promise.reject(new Error('writeResult.n is not 1'))
        this.doc = result.ops[0]
        return this
      })
    }
  }
}

class Resources {
  constructor(db) {
    this.schema = resourcesSchema
    this.db = db
    this.name = "resources"

  }

  init() {
    return this.create()
    .then((collection) => {
      this.collection = collection
      this.Resource = resourceFactory(this.collection)
      return this
    })
  }

  create() {
    return this.db.createCollection(this.name, {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    }).then((collection) => {
      return collection.createIndex({text: "text"})
      .then(() => {
        // this.collection = collection
        return collection
      })
      // return collection
    })
  }

  update(id, text) {
    return this.collection.findOneAndUpdate(
      {_id: id}, // or node.realId, or node._id...
      {$set: {text: text}},
      {returnOriginal: false}
    )
    .then((result) => {
      if (!result.ok) {
        return Promise.reject(result)
      }

      return {
        type: 'resource',
        collection: this.collection,
        doc: result.value,
        _id: result.value._id
      }
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
        anyOf: [
          {
            properties: {
              // ref to resources, or entities
              coll: { bsonType: "string", /*enum: ['resources', 'entities']*/ },
              to: { bsonType: "objectId" },
            },
            required: ['coll', 'to'],
            additionalProperties: false
          },
          {
            properties: {
              // ref to resources, or entities
              coll: { bsonType: "string", /*enum: ['resources', 'entities']*/ },
              toTerminal: {
                anyOf: [
                  {bsonType: "objectId"},
                  {bsonType: "bool"},
                ]},
            },
            required: ['coll', 'to'],
            additionalProperties: false
          },
        ],
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

function entityFactory(coll, _options) {
  _options = _options || {}
  return class {
    constructor(refs, options) {
      options = options || {}
      if (_options.log) this.log = _options.log

      this.type = 'entity'
      this.collection = coll
      this.terminal = options.terminal || false

      // this.log('Entity constructor, this', this)
      this._id = options.id || new ObjectId()
      this.refs = refs.map((ref) => {
        const refNew = {}

        if (!ref.to && !ref.toTerminal) throw new Error('invalid dref format')
        if (ref.to) refNew.to = ref.to
        if (ref.toTerminal) refNew.toTerminal = ref.toTerminal
        refNew.coll = ref.coll
        return refNew
      })

    }

    save() {
      return this.collection.insertOne({
        _id: this._id,
        refs: this.refs
      })
      .then((result) => {
        if (result.insertedCount != 1) return Promise.reject(new Error('writeResult.n is not 1'))
        this.doc = result.ops[0]
        return this
      })
    }
  }
}

class Entities {
  constructor(db, options) {
    options = options || {}

    this.name = "entities"
    this.schema = entitiesSchema
    this.db = db

    if (options.log) {
      this.log = options.log
    }
  }

  init() {
    return this.create()
    .then((collection) => {
      this.collection = collection
      this.Entity = entityFactory(this.collection, {log: this.log})
      // this.log('Entities model, this', this)
      return this
    })
  }

  create() {
    return this.db.createCollection(this.name, {
      validator: {
        $jsonSchema: this.schema
      },
      validationAction: "error"
    })
    .then((coll) => {
      // this.collection = coll
      return coll
    })
  }

  update(id, refs) {
    return this.collection.findOneAndUpdate(
      {_id: id}, // or node.realId, or node._id...
      {$set: {refs: refs.map((ref) => {
        const refNew = {coll: ref.coll}

        if (ref.toTerminal) {
          refNew.toTerminal = new ObjectId(ref.toTerminal)
        } else if (ref.to) {
          refNew.to = new ObjectId(ref.to)
        }

        return refNew
      })}},
      {returnOriginal: false}
    )
    .then((result) => {
      this.log('Entities.update, result', result)
      if (!result.ok) {
        return Promise.reject(result)
      }

      return {
        type: 'entity',
        _id: result.value._id,
        refs: result.value.refs,
        doc: result.value,
        collection: this.collection,
      }
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
      refs: refs,
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
