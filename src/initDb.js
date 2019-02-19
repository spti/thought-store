const MongoClient = require('mongodb').MongoClient
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

const url = "mongodb://localhost:27017"
const client = new MongoClient(url)

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

module.exports = {connect}
