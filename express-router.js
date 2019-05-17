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

/**
  @param {object} api
    @public {function} saveTree
      @takes {object} body
      @returns {string} JSON strigified data to send back to client
*/
function makeTheRouter(api, options) {
  options = options || {log: () => {}}

  const router = express.Router()
  const static = express.static(path.join(__dirname, '../../thought-store_frontend/dist/'))

  router.post('/save-tree', bodyParserJson, (req, res) => {
    // options.log('post /new-tree, body', req.body)

    api.saveTree(req.body)
    .then((responseData) => {
      // options.log('router, savedTree', result)

      try {
        JSON.parse(responseData)
      } catch(err) {
        res.status(502) // or 500...
        res.set('Content-Type', 'text/plain')
        res.send('api returned invalid data')
      }

      res.status(200)
      res.set('Content-Type', 'application/json')

      // options.log('saved and prettified thoughts, sending', thoughts)
      // this has to be the saved tree
      res.send(responseData)
    })
    .catch((err) => {
      res.status(502) // or 500...
      res.set('Content-Type', 'text/plain')
      res.send('something went wrong with saving thoughts')
    })

    // "<html><head></head><body>something gone wrong when saving the tree to the database, the err.message: "+ err.message +"</body></html>"

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
