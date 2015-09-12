'use strict'

let debug = require('debug')('www-alpina:index')

let createApp = require('./src/server/app')

let app = createApp()

let server = app.listen(process.env.PORT, function() {
    debug('Application server listening on %s:%s', server.address().address, server.address().port)
})
