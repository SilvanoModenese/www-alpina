'use strict'

let compression = require('compression')
let debug       = require('debug')('www-alpina:app')
let express     = require('express')

const HTML_DIR = './dist/html/'

module.exports = function (services, config) {

    let app = express()
    app.use(compression())
    app.use(express.static(process.env.PWD + '/dist'))

    let sendFileOptions = {
        root: HTML_DIR,
        dotfiles: 'deny',
        lastModified: true
    }

    app.get('/', function (req, res) {

        res.sendFile('index.html', sendFileOptions)

    })

    app.get('/faq', function (req, res) {

        res.sendFile('faq.html', sendFileOptions)

    })

    app.get('/ModeneseSilvano', function (req, res) {

        res.sendFile('ModeneseSilvano.html', sendFileOptions)

    })

    // error middleware
    app.use(function(err, req, res, next) {

        res.sendFile('not-found.html', sendFileOptions)

    })

    app.use(function(req, res) {

        res.sendFile('not-found.html', sendFileOptions)

    })


    return app

}
