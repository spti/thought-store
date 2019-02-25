const DbWrap = require("./initDb.js")
const models = require("./models.js")

function instantiateDbWrap() {
  const url = "mongodb://localhost:27017"
  const urlRs = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019"
  const dbName = "thought-store"

  return new DbWrap(urlRs, dbName, [
    models.entities,
    models.resources,
    models.views,
    models.labels
  ],
  {devEnv: true, clientOps: {replicaSet: "rs"}})
}

module.exports = {instantiateDbWrap}
