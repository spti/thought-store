const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID

const url = "mongodb://localhost:27017"
const urlRs = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019"
const dbName = "test-db"

const tree = {
  name: "0--01",
  children: [
    { name: "1--01", children: [] },
    { name: "1--02", children: [ {name: "2--01", children: []} ] },
    { name: "1--03", children: [] },
  ]
}

const compound = {
  content: "the content",
  reference: { referencedContent: "the content of the referenced document" }
}

class Test {
  constructor(url, dbName, options) {
    options = options || {}
    this.devEnv = options.devEnv || false
    this.logs = []

    this.client = new MongoClient(url, options.clientOps || {})
    this.dbName = dbName
    // this.resourcesSchema = resourcesSchema
  }

  init() {
    return this.wireUp(this.client, this.dbName)

    .then((db) => {
      this.log('created db:', db)

      this.db = db
      return this.createCollectionA(this.db)
      .then((collection) => {
        this.log("created collectionA:", collection)
        this.collectionA = collection
        return this.createCollectionB(this.db)
      })
      .then((collection) => {
        this.log("created collectionB:", collection)
        this.collectionB = collection
        return this
      })
    })
  }

  wireUp(client, dbName) {
    return client.connect()
    .then((client) => {
      const db = client.db(dbName)
      return db
    })
  }

  createCollectionA(db) {
    return db.createCollection("test-collectionA", {
      // validator: {
      //   $jsonSchema: resources
      // }
    }).then((collection) => {
      // return collection.createIndex({text: "text"})
      return collection
    })
  }

  createCollectionB(db) {
    return db.createCollection("test-collectionB", {
      // validator: {
      //   $jsonSchema: resources
      // }
    }).then((collection) => {
      // return collection.createIndex({text: "text"})
      return collection
    })
  }

  writeViaTransaction() {
    const session = this.client.startSession()
    return this.doWriteViaTransaction(session)
    .then(
      (result) => {
        session.endSession()
        return {
          msg: "write succeeded",
          result
        }
      },

      // transaction aborted, decide whether to retry write or return the error
      (err) => {

        // we don't retry, so I end the session
        session.endSession()
        return Promise.reject({
          msg: "write failed, err",
          err: err
        })
      }
    )
  }

  doWriteViaTransaction(session) {
    session.startTransaction()

    return this.writeJoin(session)
    .then((results) => {
      this.log('writeJoin resolved, committing transaction', results)
      return session.commitTransaction()
        .then(() => {
          return results
        })
    }, (err) => {
      this.log('writeJoin rejected, aborting transaction', results)
      return session.abortTransaction()
      .then(() => {
        return Promise.reject(err)
      })
    })
  }

  writeJoin(session) {
    const results = []
    return this.collectionB.insertOne(compound.reference, {session: session})
    .then((writeResult) => {
      results.push(writeResult)
      this.log("saved child doc:", writeResult)

      return this.collectionA.insertOne({
        content: compound.content,
        reference: writeResult.insertedId
      }, {session: session})
    })
    .then((writeResult) => {
      results.push(writeResult)
      this.log("saved root doc:", writeResult)
      return results
    })
  }

  read() {

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

  log(msg, data) {
    if (this.devEnv) {
      this.logs.unshift({msg, data})
      console.log(msg, data)
    }
  }
}

const test = new Test(urlRs, dbName, {devEnv: true, clientOps: {replicaSet: "rs"}})

function run() {
  return test.init()
  .then(() => {
    return a.test.writeViaTransaction()
    .then((res) => {test.log('writetransactionres', res)})
    .catch((err) => {test.log('writeviatransactionerr', err)})
  })
}

module.exports = {test, run}
