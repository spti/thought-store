const express = require('express')
const router = require('./express-router.js')

const server = express()

server.use('/', router)

server.listen('3000')
