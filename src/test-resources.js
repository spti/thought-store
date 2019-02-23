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
]

const dbWrap = DbWrap()
dbWrap.init()
.then(() => {
  // dbWrap.db.command({listCollections: 1})
  dbWrap.db.collection("resources").insertMany(docs)
  .then((writeResult) => {
    console.log("resources.insertMany docs, result: ", writeResult)
    return
  })
  .catch((err) => {
    console.log("resources.insertMany docs failed, err: ", err)
  })
})

// module.exports = {}
