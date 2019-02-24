const DbWrap = require('./initDb.js').instantiateDbWrap
const ObjectId = require('mongodb').ObjectID


const docs = [
  {
    _id: new ObjectId(),
    text: "some text with a story here"
  },
  {
    _id: new ObjectId(),
    text: "a story, herein represented hereby"
  },
  {
    _id: new ObjectId(),
    url: "a/story/herein/represented/hereby.html"
  },
  {
    _id: new ObjectId(),
    text: "indeed a long story and a story, herein represented hereby. Henceforth ideas are those, that draw attention of Elon Musk hosted meme review - poor dead goat"
  },
  // {
  //   _id: new ObjectId(),
  //   randomDocsField: false
  // },
]

// const dbWrap =

class TheTest {
  constructor() {
    this.dbWrap = DbWrap()
  }

  init() {
    return this.dbWrap.init()
  }

  drop() {
    return this.dbWrap.drop()
    .then(() => {
      return this.dbWrap.init()
    })
    .then((result) => {
      console.log("dropped db,res", result);
    })
    // .catch((err) => {
    //   console.log("smth went wronggg!?, err: ", err);
    // })
  }

  writeResources() {
    return this.dbWrap.db.collection("resources").insertMany(docs)
    .then((writeResult) => {
      console.log("resources.insertMany docs, result: ", writeResult)
      return writeResult
    })
    // .catch((err) => {
    //   console.log("resources.insertMany docs failed, err: ", err)
    // })
  }
}
/*
drop the db

*/

const test = new TheTest()
test.logs = []

function run() {
  return test.init()
  .then(res => test.drop())
  .then(res => test.writeResources())
  .then((res) => {const msg = "wrote resources, res: "; test.logs.push({msg, res})})
  .catch((err) => {test.logs.push({msg: "something went wrong, err: ", err})})
  .finally(a => console.log(test.logs.reverse()))
}

module.exports = {test, run}
