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

function makeTheRouter(options) {
  options = options || {log: () => {}}

  const router = express.Router()
  const static = express.static(path.join(__dirname, '../../thought-store_frontend/dist/'))

  router.post('/new-tree', bodyParserJson, (req, res) => {
    options.log('post /new-tree, body', req.body)

    // if (options.onRequest) options.onRequest(req.body)

    saver.saveTree(req.body.tree, req.body.maps)
    .then((treeSaved) => {

      res.status(200)
      res.set('Content-Type', 'application/json')
      res.send(JSON.stringify({tree: treeSaved}))
    })
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
