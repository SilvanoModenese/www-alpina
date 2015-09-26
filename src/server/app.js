'use strict'

let compression = require('compression')
let debug       = require('debug')('www-alpina:app')
let express     = require('express')
let jade        = require('jade')

// templating
let template = jade.compileFile('./src/html/layout.jade')


module.exports = function (services, config) {

    let app = express()
    app.set('views', './src/html')
    app.set('view engine', 'jade')
    if (process.env.NODE_ENV === 'production') {
      app.use(forceHttps)
      app.enable('trust proxy')
    }
    app.use(compression())
    app.use(express.static(process.env.PWD + '/dist'))

    app.get('/not-found', function (req, res, next) {

        res.render('not-found', {})

    })

    app.get('/', function (req, res, next) {

        res.render('index', {})

    })

    app.get('/faq', function (req, res, next) {

        res.render('faq', {})

    })

    app.get('/azienda', function (req, res, next) {

        res.render('azienda', {})

    })

    // error middleware
    app.use(function(err, req, res, next) {

        res.status(err.status)
        res.json({error: err.message })

        return next()

    })

    return app

}
