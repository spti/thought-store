const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const bodyParserJson = bodyParser.json({type: 'application/json'})

const treelib = require('./save-tree.js')
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

function makeTheRouter(saver, options) {
  options = options || {log: () => {}}

  const router = express.Router()
  const static = express.static(path.join(__dirname, '../../thought-store_frontend/dist/'))

  router.post('/', bodyParserJson, (req, res) => {
    console.log('post, /, body:', req.body);
    options.log(req.body)

    if (options.onRequest) options.onRequest(req.body)
    // treelib.saveDeepest(req.body.tree, req.body.maps)
    res.status(200)
    res.set('Content-Type', 'text/plain')
    res.send('got the json')

  })

  router.get('/', (req, res) => {
    console.log('got the get');
    res.send('got the get')
  })

  router.use('/public', static)
  return router
}


module.exports = {makeTheRouter}
