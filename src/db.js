class Db {
  constructor(url, dbName, options) {
    this.client = new MongoClient(url, options.clientOps || {})
    this.dbName = dbName
  }

  init() {
    return this.client.connect()
    .then(() => {
      try {
        this.db = this.client.db(this.dbName)
      } catch(err) {
        return Promise.reject(err)
      }

      return this.db
    })

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
  }
}
