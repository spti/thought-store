const MongoClient = require('mongodb').MongoClient
const DBRef = require('mongodb').DBRef
const ObjectId = require('mongodb').ObjectID
// const schemas = require('./schema.js')
const lib = require('./save-tree.js')
const trees = require('./fake-trees.js')
const models = require('./models.js')

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

      this.entities = new models.Entities(this.db, {log: this.log.bind(this)})
      this.resources = new models.Resources(this.db, {log: this.log.bind(this)})

      return this.entities.init()
      .then(() => {
        return this.resources.init()
      })
    })
  }

  // this gets passed as a callback to saveDeepest, so
  // we can be sure that for every @node, it's descendants
  // (if it has those) are already saved/updated
  saveOne(node, map) {
    this.log('saveOne, node:', node)
    if (node.status == 'new') {
      this.log('saveOne, a node status is new', node)
      if (node.type == 'resource') {
        const resource = new this.resources.Resource(node.text)
        // this.log('saveOne, newly created resource:', resource)
        return resource.save()
        .then((instance) => {
          map.saved[instance.doc._id.toHexString()] = instance
          map.toSaved[node._id] = instance.doc._id.toHexString()
          // map.saved[instance.doc._id.toHexString()] = instance
          // map.toSaved[node._id] = instance.doc._id.toHexString()

          this.log('saveOne, saved resource:', instance)
          return instance
        })
      } else if (node.type == 'entity') {
        const refsNew = []

        node.refs.forEach((ref) => {
          const refNew = {
            // as we save or update nodes (especially if we save new nodes), we will add
            // them to the map.saved. But we will not update refs of ancestrial nodes to point
            // to new ids. So we will have the toSaved mapping of old ids to new ones.
            coll: map.saved[map.toSaved[ref.to || ref.toTerminal]].collection.collectionName
          }

          if (ref.toTerminal) {
            refNew.toTerminal = false
          }

          if (ref.to) {
            refNew.to = map.saved[map.toSaved[ref.to]]._id
          }

          refsNew.push(refNew)
        })

        const entity = new this.entities.Entity(refsNew)
        // this.log('saveOne, newly created entity:', entity)
        return entity.save()
        .then((instance) => {
          map.saved[instance.doc._id.toHexString()] = instance
          map.toSaved[node._id] = instance.doc._id.toHexString()

          // check for terminal refs and add the node to maps if there is
          // for (var i = 0; i < instance.doc.refs.length; i++) {
          //   if (instance.doc.refs[i].toTerminal) {
          //     // we use the real id, but the superficial refs, because using those
          //     // we will be able to substitute patched toTerminal's with proper ids
          //     map.withTerminalRefs[instance.doc._id] = node
          //     break
          //   }
          // }

          this.log('saveOne, saved entity:', instance)
          return instance
        })
      }
    } else if (node.status == 'changed') {
      this.log('a node status is changed', node)
      // return
      if (node.type == 'resource') {
        return this.resources.update(
          new ObjectId(node._id),
          node.text
        )
        .then((instance) => {
          map.saved[instance._id.toHexString()] = instance
          map.toSaved[instance._id.toHexString()] = instance._id.toHexString()

          this.log('updated resource', instance)
          return instance
        })

      } else if (node.type == 'entity') {
        const refsNew = []

        node.refs.forEach((ref) => {
          const refNew = {
            // as we save or update nodes (especially if we save new nodes), we will add
            // them to the map.saved. But we will not update refs of ancestrial nodes to point
            // to new ids. So we will have the toSaved mapping of old ids to new ones.
            coll: map.saved[map.toSaved[ref.to || ref.toTerminal]].collection.collectionName
          }

          if (ref.toTerminal) {
            refNew.toTerminal = false
          }

          if (ref.to) {
            refNew.to = map.saved[map.toSaved[ref.to]].doc._id
          }

          refsNew.push(refNew)
        })

        this.log('saveOne, entity is to update, new refs:', refsNew)

        return this.entities.update(new ObjectId(node._id), refsNew)
        .then((instance) => {
          map.saved[instance._id.toHexString()] = instance
          map.toSaved[instance._id.toHexString()] = instance._id.toHexString()

          this.log('updated entity', instance)
          return instance
        })
      }
    } else if (node.status == 'unchanged') {
      this.log('node unchanged, node', node)
      var instance = null

      if (node.type == 'entity') {
        instance = new this.entities.Entity(node.refs.map((ref) => {
          var refNew = {coll: map.saved[map.toSaved[ref.to || ref.toTerminal]].collection.collectionName}
          if (ref.to) refNew.to = ref.to
          if (ref.toTerminal) refNew.toTerminal = ref.toTerminal
          return refNew
        }), {id: node._id})
      } else if (node.type == 'resource') {
        instance = new this.resources.Resource(node.text, {id: node._id})
      } else {
        return Promise.reject(new Error('node must have a type, instead got', node.type))
      }

      this.log('node unchanged, instance', instance)
      instance.doc = node
      map.saved[instance._id] = instance
      map.toSaved[instance._id] = instance._id

      return Promise.resolve(instance)
    }
  }

  /*
  saveOne(node, maps) {
    this.log('saveOne, node', node);
    // const doc = {}

    if (node.type == 'text') {

      return this.resources.saveOneText(node.value)
      .then((result) => {
        this.log('saveOne, saved the doc', result.ops[0])
        if (result.insertedCount != 1) return Promise.reject(new Error('writeResult.n is not 1'))
        node.doc = result.ops[0]
        return node
      })
    } else if (node.type == 'entity') {
      if (node.children && node.children.length > 0) {
        const refs = node.children.map((child) => {
          // this.log("saveOne, node's child", child)

          const coll =
            (child.type == 'entity' || child.type == 'label') ? 'entities'
            : (child.type == 'text') ? 'resources'
            : null

          if (!coll) {Promise.reject(new Error('cant determine the collection to which a child belongs'))}

          const referee = (child.type == 'label') ? maps.ids[child.to].doc : child.doc
          return this.entities.createRef(referee, coll, child.terminal)
        })

        // this.log('saveOne, entity to save', doc)
        return this.entities.saveOne(refs)
        .then((result) => {
          this.log('saveOne, saved entity', result.ops[0])
          if (result.insertedCount != 1) return Promise.reject(new Error('writeResult.n is not 1'))
          node.doc = result.ops[0]
          return node
        })
      }
    }

  }
  */

  saveTree(tree, map) {
    const treeDescribed = lib.describeToSave(tree, map)
    this.log('described tree to save, tree', treeDescribed)
    map.saved = {}
    map.toSaved = {}
    map.withTerminalRefs = {}

    // return
    return lib.saveDeepestAsync(tree || this.trees.tree0dbsSparse, map, this.saveOne.bind(this))
    // .then((savedTree) => {
    //   this.log('saved tree,', savedTree)
    //   return savedTree
    // })
  }

  doQueryTree(nodeId) {
    return this.entities.collection.aggregate([
      {$match: {
        _id: nodeId
      }},
      {$graphLookup: {
        from: 'resources',
        connectFromField: 'refs.to',
        startWith: '$refs.to',
        connectToField: '_id',
        as: 'resourcesRoot',
        depthField: 'depth'
      }},
      {$graphLookup: {
        from: 'entities',
        connectFromField: 'refs.to',
        startWith: '$refs.to',
        connectToField: '_id',
        as: 'entities',
        depthField: 'depth'
      }},
      {$unwind: '$entities'},
      {$project: {
        resourcesRoot: 1,
        refs: 1,
        referee: '$entities'
      }},
      {$graphLookup: {
        from: 'resources',
        connectFromField: 'referee.refs.to',
        startWith: '$referee.refs.to',
        connectToField: '_id',
        as: 'resources',
        depthField: 'depth'
      }},
      // {$graphLookup: {
      //   from: 'views',
      //   connectFromField: 'child.children.to',
      //   startWith: '$child.children.to',
      //   connectToField: '_id',
      //   as: 'views',
      //   depthField: 'depth'
      // }},
    ])
    .toArray()

  }

  queryTree(nodeName) {
    if (!nodeName) {
      this.doQueryTree(this.tree.doc._id)
      .then((docs) => {
        this.log('queriedTree, docs', docs)
      })
      .catch((err) => {
        this.log('queryTree rejected,', err)
      })
    } else {
      this.one.findOne({name: nodeName})
      .then((result) => {
        return this.doQueryTree(result._id)
      })
      .then((docs) => {
        this.log('queriedTree, docs', docs)
      })
      .catch((err) => {
        this.log('queryTree rejected,', err)
      })
    }
  }

  doBuildMap(aggregatedNodes) {
    const maps = {}

    var i = 0; const len = aggregatedNodes.length
    for (i; i < len; i++) {
      const referee = aggregatedNodes[i].referee

      const refereeId = referee._id.toHexString()
      if (!maps[refereeId]) maps[refereeId] = referee

      if (aggregatedNodes[i].resources && aggregatedNodes[i].resources.length > 0) {
        for (var ii = 0; ii < aggregatedNodes[i].resources.length; ii++) {
          const resource = aggregatedNodes[i].resources[ii]
          const resourceId = resource._id.toHexString()

          if (!maps[resourceId]) maps[resourceId] = resource
        }
      }
    }

    return maps
  }

  buildMap(queryResult) {
    const map = this.doBuildMap(queryResult)
    queryResult[0].resourcesRoot.forEach((resource) => {map[resource._id.toHexString()] = resource})
    map.root = {
      _id: queryResult[0]._id.toHexString(),
      refs: queryResult[0].refs
    }

    this.log('maps', map)
    return map
  }

  /*

  doBuildTree(aggregatedNodes, maps, root) {
    const entities = []
    aggregatedNodes.forEach((node) => {
      entities.push(node.ref)
    })


  }

  doBuildTree(node, nodes) {
    this.log('doBuildTree, node', node.name)

    if (!node.children || node.children.length == 0) {

      return {node, nodes}
    }

    var i = 0; const len = node.children.length
    for (i; i < len; i++) {
      const child = node.children[i]
      // this.log('ii loop, child', child)
      var childIndex = nodes.ids.indexOf(child.to.toHexString())

      if (childIndex == -1) throw new Error('node missing in aggregation results')

      child.doc = nodes.nodes.splice(childIndex, 1)[0]
      // this.log('doBuildTree, child', child.doc.name)

      nodes.depths.splice(childIndex, 1)
      nodes.ids.splice(childIndex, 1)

      nodes = this.doBuildTree(child.doc, nodes).nodes
      // if (childIndex < i) i--
    }

    return {node, nodes}
  }

  doBuildTrees(nodes, children) {
    var i = nodes.depths.indexOf(0)

    if (i < 0) {
      if (nodes.nodes.length > 0) {
        throw new Error('no top level nodes left, yet the nodes array is not empty')
      }

      return children
    }

    nodes.ids.splice(i, 1)
    nodes.depths.splice(i, 1)
    const node = nodes.nodes.splice(i, 1)[0]

    const builtTree = this.doBuildTree(node, nodes)

    this.log('buildTree finished, nodes', nodes)
    children.push(builtTree.node)

    return this.doBuildTrees(builtTree.nodes, children)
    // return nodes[0]
  }

  buildTrees(root, nodes) {
    const ids = nodes.map((node) => {return node._id.toHexString()})
    const depths = nodes.map((node) => {
      return node.depth
    })

    const children = this.doBuildTrees({nodes, ids, depths}, [])

    root.children.forEach((child) => {
      const i = children.map(child => child._id.toHexString())
        .indexOf(child.to.toHexString())

      if (i < 0) throw new Error('node missing in aggregation results')

      child.doc = children.splice(i, 1)[0]
    })

    return root
  }

  queryAndBuild(nodeId) {
    // if (!nodeId) {
    //
    //   return this.doQueryTree(this.tree.doc._id)
    //   .then((docs) => {
    //     // this.log("doQueryTree result", docs[0])
    //
    //     return this.buildMap(docs)
    //   })
    // } else {

      return this.entities.collection.findOne({_id: nodeId})
      .then((result) => {
        return this.doQueryTree(result._id)
        .then((docs) => {
          this.log("doQueryTree result", docs)

          return this.buildTrees(docs[0], docs[0].nodes)
        })
      })
    // }
  }
  */

  setTree(tree) {
    this.tree = tree
  }

  trySaveTree(tree, maps) {
    this.log('trees.thoughtsSimpleNew:', trees.thoughtsSimpleNew)
    this.saveTree(trees.thoughtsSimpleNew.map.ids[trees.thoughtsSimpleNew.root], trees.thoughtsSimpleNew.map)
    .then((savedThoughts) => {
      // this.tree = savedTree
      this.log('tried and saved tree,', savedThoughts)
    })
    .catch((err) => {
      this.log('save tree failed', err)
    })
  }

  trySaveAndQueryTree() {
    this.saveTree(trees.thoughtsSimpleNew.map.ids[trees.thoughtsSimpleNew.root], trees.thoughtsSimpleNew.map)
    .then((savedThoughts) => {
      // this.tree = savedTree
      this.log('tried and saved tree,', savedThoughts)
      return this.doQueryTree(savedThoughts.tree._id)
    })
    .then((result) => {
      this.log('didQueryTree, result', result)
      return this.buildMap(result)
    })
    .then((thoughts) => {
      this.log('queried saved thoughts:', thoughts)
    })
    .catch((err) => {
      this.log('errored somewhere while querying tree and buildng map', err)
    })
  }

  trySaveOneEntity() {
    const entity = new this.entities.Entity([
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
    ])

    entity.save()
    .then((instance) => {
      this.log('tried and saved an entity', instance)
    })
  }

  tryUpdateOneEntity() {
    const entity = new this.entities.Entity([
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
    ])

    entity.save()
    .then((instance) => {
      this.log('tried and saved an entity', instance)
      const refs = [
        {to: new ObjectId(), coll: 'entities'},
        {to: new ObjectId(), coll: 'entities'},
        {to: new ObjectId(), coll: 'entities'},
        {to: new ObjectId(), coll: 'entities'},
      ]

      return this.entities.update(instance.doc._id, refs)
    })
    .then((instanceUpdated) => {
      this.log('tried and updated an entity', instanceUpdated)
      // return this.entities.collection.findOne({_id: instanceUpdated.doc._id})
      // .then((result) => {
      //   this.log('found the updated doc:', result)
      // })
      // .catch((err) => {
      //   this.log('errored when trying to find the updated doc', err)
      //   return Promise.reject(err)
      // })

    })
    .catch((err) => {
      this.log('errored when tryingUpdateOneEntity', err)
    })
  }

  trySaveOneResource() {
    const resource = new this.resources.Resource("a test resource!")
    resource.save()
    .then((instance) => {
      this.log('tried and saved a resource', instance)
    })
  }

  tryUpdateOneResource() {
    const resource = new this.resources.Resource("a test resource!")
    resource.save()
    .then((instance) => {
      this.log('tried and saved a resource', instance)
      return this.resources.update(instance.doc._id, 'this is the updated resource!')
    })
    .then((result) => {
      this.log('tried and updated the resource', result)
    })
    .catch((err) => {
      this.log('err during tryingUpdateOneResource', err)
    })
  }

  /*
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
  */

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
