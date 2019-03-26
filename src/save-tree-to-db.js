const MongoClient = require('mongodb').MongoClient
const DBRef = require('mongodb').DBRef
// const ObjectId = require('mongodb').ObjectID
// const schemas = require('./schema.js')
const lib = require('./save-tree.js')
const trees = require('./fake-trees.js')

class TryThings {
  constructor(url, dbName, options) {
    options = options || {}
    this.devEnv = options.devEnv || false
    this.logs = []

    this.trees = trees

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

      return this.createCollection(this.db)
    })
  }

  createCollection(db) {
    return db.createCollection("one")
    .then((coll) => {
      this.one = coll
      return db.createCollection("two")
    })
    .then((coll) => {
      this.two = coll
      return coll
    })
    // .then((collection) => {
    //   return collection.createIndex({text: "text"})
    //   .then(() => {
    //     return collection
    //   })
    //   // return collection
    // })
  }

  saveOne(node) {
    this.log('saveOne, node', node.name);
    const doc = {}

    if (node.children && node.children.length > 0) {
      doc.children = node.children.map((child) => {
        this.log("saveOne, node's child", child)
        return {coll: child.coll, to: child.savedId, terminal: child.terminalRef}
      })
    }

    doc.name = node.name
    this.log('saveOne, the new doc:', doc)

    return this[node.coll].insertOne(doc)
    .then((result) => {
      doc.savedId = result.insertedId
      node = doc
      return node
    })

  }


  saveTree(tree) {
    return lib.traverseAsync(tree || this.trees.tree0dbsDense, this.saveOne.bind(this))
    .then((savedTree) => {
      this.tree = savedTree
      this.log('saved tree,', savedTree)
    })
    .catch((err) => {
      this.log('save tree failed', err)
    })
  }

  doQueryTree(root) {
    return this.one.aggregate([
      {$match: {
        _id: this.tree._id
      }},
      {$graphLookup: {
        from: 'one',
        connectFromField: 'children.to',
        startWith: '$children.to',
        connectToField: '_id',
        as: 'referee'
      }}
    ])
    .toArray()

  }

  queryTree() {
    this.doQueryTree()
    .then((docs) => {
      this.log('queriedTree, docs', docs)
    })
    .catch((err) => {
      this.log('queryTree rejected,', err)
    })
  }

  buildTree() {
    
  }

  setTree(tree) {
    this.tree = tree
  }

  createDocWithRef() {
    return this.one.insertOne({a: 'referee'})
    .then((result) => {
      return this.one.insertOne({
        a: 'referer',
        ref: new DBRef("one", {oid: result.insertedId})
      })

    })
  }

  tryCreateDocWithRef() {
    this.createDocWithRef()
    .then((result) => {
      this.log('saved a doc, result', result)
    })
    .catch((err) => {
      this.log('err occured whaile tryCreateDocWithRef', err)
    })
  }

  doGetDocWithRef() {
    return this.one.findOne({
      a: "referer"
    })
  }

  getDocWithRef() {
    this.doGetDocWithRef()
    .then((result) => {
      this.log('got the doc with ref, result', result)
    })
    .catch((err) => {
      this.log('err occured whaile doGetDocWithRef', err)
    })
  }

  doDrop() {
    if (this.db) {
      return this.db.dropDatabase()
    } else {
      return this.wireUp(this.client, this.dbName)
      .then((db) => {
        return db.dropDatabase()
      })
    }
  }

  drop() {
    this.doDrop()
    .then((r) => {this.log('dropped', r)})
    .catch((e) => {this.log('drop rejected', e)})
  }

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}

function instantiate() {
  const url = "mongodb://localhost:27017"
  const urlRs = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019"
  const dbName = "thought-store"

  return new TryThings(url, dbName,
  {devEnv: true})
}

module.exports = instantiate()
