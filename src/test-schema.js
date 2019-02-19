const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
// const db = require("./connection.js")

/*
db.createCollection("resources", {
  validator: {
    $jsonSchema: resouces
  },
  validationAction: "error"
})

db.createCollection("textResources", {
  validator: {
    $jsonSchema: textResouces
  },
  validationAction: "error"
})


// db.createIndex('resources')
*/

const subSchemaStr = {
  bsonType: "object",
  required: ['_id', 'text'],
  properties: {
    _id: {
      bsonType: "objectId"
    },
    text: {
      bsonType: "string"
    }
  }
}

const subSchemaNum = {
  bsonType: "object",
  required: ['_id', 'quantity'],
  properties: {
    _id: {
      bsonType: "objectId"
    },
    quantity: {
      bsonType: "number"
    }
  }
}

const mainSchema = {
  type: "object",
  properties: {
    _id: {
      bsonType: "objectId"
    },
    value: {
      bsonType: "object",
      oneOf: [subSchemaStr, subSchemaNum]
    }
  }
}

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

function createColl(db, collName, schema) {
  db.createCollection(collName, {
    validator: {
      $jsonSchema: schema
    },
    validationAction: "error"
  })
}

const docStr = {
  _id: new ObjectId(),
  value: {
    _id: new ObjectId(),
    text: "some random text here"
  }
}

const docNum = {
  _id: new ObjectId(),
  value: {
    _id: new ObjectId(),
    quantity: 56
  }
}

connect()
.then((client) => {
  const db = client.db(dbName)
  return db.createCollection("main", {
    validator: {
      $jsonSchema: mainSchema
    },
    validationAction: "error"
  })
})
.then((mainColl) => {
  console.log('inserting docStr: ', docStr);
  return mainColl.insertOne(docStr)
}, (err) => {
  console.log("createCollection err: ", err);
  return Promise.reject(err)
})
.then((result) => {
  console.log("inserted docStr, result: ", result);
  console.log('inserting docNum: ', docNum);
  return mainColl.insertOne(docNum)
}, (err) => {
  console.log('docStr insert err: ', err);
  return Promise.reject(err)
})
.then((result) => {
  console.log("inserted docNum, result: ", result);
  return result
}, (err) => {
  console.log('docNum insert err: ', err);
  return Promise.reject(err)
})
.catch((err) => {console.log(err)})

module.exports = {connect, createColl, mainSchema}
