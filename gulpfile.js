var fs = require('fs')

var gulp = require('gulp')
var del = require('del')
var rename  = require('gulp-rename')
var jade    = require('gulp-jade')
var plumber = require('gulp-plumber')
var stylus  = require('gulp-stylus')
var replace = require('gulp-replace')
var connect = require('gulp-connect')
var uglify  = require('gulp-uglify')
var runSequence = require('run-sequence')

var config = require('./src/config')



gulp.task('clean-dist', function(callback) {
  del('./dist', callback)
})

gulp.task('clean-tmp', function(callback) {
  del('./tmp', callback)
})

gulp.task('template', function() {
  return gulp.src('./src/html/**/*')
    .pipe(
      jade({
        locals: config,
        pretty: true
      })
    )
    .pipe(gulp.dest('./dist/html'))
    .pipe(connect.reload())
})

gulp.task('styles', function() {
  return gulp.src('./src/styles/**/*.styl')
    .pipe(replace('__URL__', config.url))
    .pipe(plumber())
    .pipe(stylus({
      use: [
        require('nib')(),
        require('rupture')(),
        require('jeet')()
      ],
      sourcemap: {
        inline: true,
        sourceRoot: './src/styles/'
      }
    }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./dist/styles'))
    .pipe(connect.reload())
})

gulp.task('images', function() {
  return gulp.src('./src/assets/images/**/*')
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('fonts', function() {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('connect', function() {
  return connect.server({
    root: './dist',
    port: 3000,
    // host: '192.168.1.101',
    livereload: true
  })
})

gulp.task('watch', function() {
  gulp.watch('./src/html/**/*.jade', ['template'])
  return gulp.watch('./src/styles/**/*.styl', ['styles'])
})

gulp.task('default', function(callback) {
  runSequence(
    ['clean-dist', 'clean-tmp'], ['template', 'styles', 'images', 'fonts'], ['connect', 'watch'],
    callback
  )
})


gulp.task('build-styles', function() {
  return gulp.src('./src/styles/**/*.styl')
    .pipe(replace('__URL__', config.url))
    .pipe(plumber())
    .pipe(stylus({
      use: [
        require('nib')(),
        require('rupture')(),
        require('jeet')()
      ],
      compress: true
    }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./dist/styles'))
})

gulp.task('robots', function() {
  return gulp.src('./src/robots.txt')
    .pipe(replace('__URL__', config.url))
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', function(callback) {
  return runSequence(
    ['clean-dist', 'clean-tmp'], ['template', 'styles', 'javascripts', 'images', 'fonts'],
    'clean-dist', ['build-styles', 'images', 'fonts', 'robots'],
    callback
  )
})
