// const Buffer = require('buffer').Buffer
// const utf8 = require('utf8')
// const Binary = require('mongodb').Binary
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
// const db = require("./connection.js")

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

const simpleSchemaStr = {
  bsonType: "object",
  properties: {
    _id: {
      bsonType: "objectId"
    },
    text: {
      bsonType: "string"
    },
  },
  additionalProperties: false
}

const simpleSchemaNum = {
  bsonType: "object",
  properties: {
    _id: {
      bsonType: "objectId"
    },
    amount: {
      bsonType: "number"
    },
  },
  additionalProperties: false
}

const compoundSchema = {
  bsonType: "object",
  anyOf: [
    simpleSchemaStr,
    simpleSchemaNum
  ],
}

const simpleDocStr = {
  _id: new ObjectId(),
  text: "some fucking string"
}

const simpleDocNum = {
  _id: new ObjectId(),
  amount: 55
}

class TestIt {
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

  doTestCompound() {
    return this.db.createCollection("compound", {
      validator: {
        $jsonSchema: compoundSchema01
      },
      validationAction: "error"
    }).then((coll) => {
      this.compoundColl = coll
      console.log('compound.insert docStr: ', simpleDocStr);
      return coll.insertOne(simpleDocStr)
    })

    .then((result) => {
      console.log('compound.insert docStr, result: ', result);
      console.log('compound.insert docNum: ', simpleDocNum);
      return this.compoundColl.insertOne(simpleDocNum)
    })
    .then((result) => {
      console.log("compound.inserted docNum, result: ", result);
      const docRandom = {
        _id: new ObjectId(),
        randomProp: false
      }

      // console.log('compound.insert random doc:', docRandom);
      return this.compoundColl.insertOne(docRandom)
      // return
    })
    .then(res => console.log('inserted XYZ doc, res:', res))
  }

  doTestSimpleStr() {
    return this.db.createCollection("simpleStr", {
      validator: {
        $jsonSchema: simpleSchemaStr
      },
      validationAction: "error"
    }).then((coll) => {
      this.simpleStrColl = coll
      console.log('simpleDocNum: ', simpleDocStr);
      return coll.insertOne(simpleDocStr)
    }, (err) => {
      console.log("createCollection err: ", err);
      return Promise.reject(err)
    })
  }

  doTestSimpleNum() {
    return this.db.createCollection("simpleNum", {
      validator: {
        $jsonSchema: simpleSchemaNum
      },
      validationAction: "error"
    }).then((coll) => {
      this.simpleNumColl = coll
      console.log('inserting simpleDocNum: ', simpleDocNum);
      return coll.insertOne(simpleDocNum)
    }, (err) => {
      console.log("createCollection err: ", err);
      return Promise.reject(err)
    })
  }

  testCompound() {
    return this.doTestCompound()
    .catch((err) => {
      console.log("testCompound, something gone wrong, err: ", err);
      this.testCompoundErr = err
    })
    .finally(() => {

    })
  }

  testSimpleStr() {
    return this.doTestSimpleStr()
    .catch((err) => {
      console.log("testSimpleStr, something gone wrong, err: ", err);
      this.testSimpleStrErr = err
    })
    .finally(() => {

    })
  }

  testSimpleNum() {
    return this.doTestSimpleNum()
    .catch((err) => {
      console.log("testSimpleStr, something gone wrong, err: ", err);
      this.testSimpleNumErr = err
    })
    .finally(() => {

    })
  }

}

module.exports = {env: new TestIt()}
