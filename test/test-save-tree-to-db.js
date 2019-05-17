class TestSaveTreeToDb extends Dev {
  constructor() {

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


}
