const MongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"
const client = new MongoClient(url)
const dbName = "test-db"

function connect() {
  return new Promise((resolve, reject) => {
    client.connect((err, client) => {
      if (err) {
        reject(err)
      } else {
        resolve(client)
      }
    })
  })
}

class Test {
  constructor() {
    this.init()
  }

  init() {
    return connect().then((client) => {
      this.client = client
      const db = client.db(dbName)
      return db.dropDatabase()
    }).then(() => {
      this.db = this.client.db(dbName)
    })
  }

  createColl() {
    return this.db.createCollection("text", {
    }).then((coll) => {
      this.textColl = coll
      return this.textColl.createIndex({"$**": "text"})
      // return coll.insertOne(simpleDocStr)
    })
  }
}
