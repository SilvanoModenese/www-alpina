'use strict'

let debug = require('debug')('www-alpina:index')

let createApp = require('./src/server/app')

let app = createApp()

let port = process.env.PORT || 3000

let server = app.listen(port, function() {
    debug('Application server listening on %s:%s', server.address().address, server.address().port)
})
