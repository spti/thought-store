const Dev = require('./dev.js')

class CrudTreeTest extends Dev {
  constructor(crudTree) {
    super((options.devEnv) ? options.devEnv : false)

    this.crud = crudTree
  }

  trySaveTree(tree, maps) {
    this.crud.log('trees.thoughtsSimpleNew:', trees.thoughtsSimpleNew)
    this.crud.saveTree(trees.thoughtsSimpleNew.map.ids[trees.thoughtsSimpleNew.root], trees.thoughtsSimpleNew.map)
    .then((savedThoughts) => {
      // this.crud.tree = savedTree
      this.crud.log('tried and saved tree,', savedThoughts)
    })
    .catch((err) => {
      this.crud.log('save tree failed', err)
    })
  }

  trySaveAndQueryTree() {
    this.crud.saveTree(trees.thoughtsSimpleNew.map.ids[trees.thoughtsSimpleNew.root], trees.thoughtsSimpleNew.map)
    .then((savedThoughts) => {
      // this.crud.tree = savedTree
      this.crud.log('tried and saved tree,', savedThoughts)
      return this.crud.doQueryTree(savedThoughts.tree._id)
    })
    .then((result) => {
      this.crud.log('didQueryTree, result', result)
      return this.crud.buildMap(result)
    })
    .then((thoughts) => {
      this.crud.log('queried saved thoughts:', thoughts)
    })
    .catch((err) => {
      this.crud.log('errored somewhere while querying tree and buildng map', err)
    })
  }

  trySaveOneEntity() {
    const entity = new this.crud.entities.Entity([
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
    ])

    entity.save()
    .then((instance) => {
      this.crud.log('tried and saved an entity', instance)
    })
  }

  tryUpdateOneEntity() {
    const entity = new this.crud.entities.Entity([
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
      {to: new ObjectId(), coll: 'entities'},
    ])

    entity.save()
    .then((instance) => {
      this.crud.log('tried and saved an entity', instance)
      const refs = [
        {to: new ObjectId(), coll: 'entities'},
        {to: new ObjectId(), coll: 'entities'},
        {to: new ObjectId(), coll: 'entities'},
        {to: new ObjectId(), coll: 'entities'},
      ]

      return this.crud.entities.update(instance.doc._id, refs)
    })
    .then((instanceUpdated) => {
      this.crud.log('tried and updated an entity', instanceUpdated)
      // return this.crud.entities.collection.findOne({_id: instanceUpdated.doc._id})
      // .then((result) => {
      //   this.crud.log('found the updated doc:', result)
      // })
      // .catch((err) => {
      //   this.crud.log('errored when trying to find the updated doc', err)
      //   return Promise.reject(err)
      // })

    })
    .catch((err) => {
      this.crud.log('errored when tryingUpdateOneEntity', err)
    })
  }

  trySaveOneResource() {
    const resource = new this.crud.resources.Resource("a test resource!")
    resource.save()
    .then((instance) => {
      this.crud.log('tried and saved a resource', instance)
    })
  }

  tryUpdateOneResource() {
    const resource = new this.crud.resources.Resource("a test resource!")
    resource.save()
    .then((instance) => {
      this.crud.log('tried and saved a resource', instance)
      return this.crud.resources.update(instance.doc._id, 'this is the updated resource!')
    })
    .then((result) => {
      this.crud.log('tried and updated the resource', result)
    })
    .catch((err) => {
      this.crud.log('err during tryingUpdateOneResource', err)
    })
  }


}

module.exports = CrudTreeTest
