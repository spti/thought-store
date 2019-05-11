const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const bodyParserJson = bodyParser.json({type: 'application/json'})

const treelib = require('./save-tree.js')
const saver = require('./save-tree-to-db.js')
/*
const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/images/')
  },
  filename: function (req, file, cb) {
    const pathParsed = path.parse(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + pathParsed.ext)
  }
})
const upload = multer({storage: storage})
*/

function doPrettifyMap(node, map, mapNew, coll) {
  if (node.refs && node.refs.length > 0) {
    node.refs.forEach((ref) => {
      // mapNew.ids[ref.to] = map.saved[ref.to].doc
      doPrettifyMap(map.saved[ref.to], map, mapNew, ref.coll)
    })
  }

  node.doc.type = (coll == 'entities') ? 'entity' : 'resource'
  mapNew.ids[node.doc._id] = node.doc
  return {tree: node.doc, map: mapNew}
}

function prettifyMap(thoughts) {
  return doPrettifyMap(
    thoughts.tree, thoughts.map, {ids: {}},
    (thoughts.tree.refs) ? 'entities' : 'resources'
  )
}

function makeTheRouter(options) {
  options = options || {log: () => {}}

  const router = express.Router()
  const static = express.static(path.join(__dirname, '../../thought-store_frontend/dist/'))

  router.post('/new-tree', bodyParserJson, (req, res) => {
    options.log('post /new-tree, body', req.body)

    res.status(200)
    res.set('Content-Type', 'application/json')

    saver.saveTree(req.body.tree, req.body.map)
    .then((result) => {
      const thoughts = prettifyMap(result)

      options.log('saved and prettified thoughts, sending', thoughts)
      // this has to be the saved tree
      res.send(JSON.stringify(thoughts))
    })


    // saver.saveTree(req.body)
    // .then((thoughts) => {
    //   res.status(200)
    //   res.set('Content-Type', 'application/json')
    //
    //   // this has to be the saved tree
    //   res.send(JSON.stringify(thoughts))
    // })
    // .catch((err) => {
    //   res.status(500)
    //   res.set('Content-Type', 'text/plain')
    //
    //   // this has to be the saved tree
    //   res.send("<html><head></head><body>something gone wrong when saving the tree to the database, the err.message: "+ err.message +"</body></html>")
    // })

    // if (options.onRequest) options.onRequest(req.body)

  })

  router.get('get-roots', (req, res) => {

  })

  router.get('/', (req, res) => {
    console.log('got the get');
    res.send('got the get')
  })

  router.use('/public', static)
  return {router, saver}
}


module.exports = {makeTheRouter}
