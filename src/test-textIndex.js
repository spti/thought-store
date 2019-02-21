const MongoClient = require('mongodb').MongoClient

const url = "mongodb://localhost:27017"
const client = new MongoClient(url)
const dbName = "test-db"

const docSchema = {
  bsonType: "object",
  properties: {
    text: "string"
  }
}

const docs = [
  {
    text: "nipple"
  },
  {
    text: "fantasy"
  },
  {
    text: "orgasm"
  },
  {
    text: "story"
  },
  {
    text: "history"
  },
  {
    text: "history sees the story of nipples and apples, being so fantastic and organic that they indeed drive girls to orgasms"
  },
]

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
    this.init().catch((err) => {
      console.log("init failed, err: ", err);
    })
  }

  init() {
    return connect().then((client) => {
      this.client = client
      const db = client.db(dbName)
      return db.dropDatabase()
    }).then(() => {
      this.db = this.client.db(dbName)
    }).then(() => {
      return this.createColl()
    })
  }

  createColl() {
    return this.db.createCollection("text", {
    }).then((coll) => {
      this.textColl = coll
      return this.textColl.createIndex({text: "text"})
      // return coll.insertOne(simpleDocStr)
    })
  }

  doInsertDocs(docs) {
    return this.textColl.insertMany(docs)
  }

  insertDocs() {
    return this.doInsertDocs(docs)
    .then((result) => {
      console.log("doInsertDocs resolved, result: ", result);
      return result
    })
    .catch((err) => {
      console.log("doInsertDocs rejected, err", err);
    })
  }

  searchText() {
    return test.testText.textColl
      .find({$text: {$search: "story"}}).toArray()
      .then((result) => {test.findRes = result; console.log('find result:', result)})
      .catch((err) => {console.log('textColl.find failed, err:', err)})

  }
}

module.exports = {testText: new Test()}
