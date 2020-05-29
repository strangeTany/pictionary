const express = require('express')
const app = express()
const server = require('http').Server(app)

let port = process.env.PORT || 8000
server.listen(port, () => {
    console.log('192.168.43.149')
})