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

var config = require('./src/config')

gulp.task('clean-dist', function(callback) {
  del('./dist', callback)
})

gulp.task('clean-tmp', function(callback) {
  del('./tmp', callback)
})

gulp.task('template', function() {
  return gulp.src('./src/html/**/*.jade')
    .pipe(
      jade({
        locals: config,
        pretty: true
      })
    )
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
})

gulp.task('styles', function() {
  return gulp.src('./src/html/styles/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: [
        require('nib')(),
        require('rupture')()
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
  return gulp.src('./src/html/assets/images/**/*')
    .pipe(gulp.dest('./dist/images'))
})

gulp.task('vendors', function() {
  return gulp.src('./src/html/vendors/**/*')
    .pipe(gulp.dest('./dist/vendors'))
})

gulp.task('modules', function() {
  return gulp.src('./node_modules/**/dist/**/*.js')
    .pipe(gulp.dest('./dist/modules'))
})

gulp.task('fonts', function() {
  return gulp.src('./src/html/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'))
})

gulp.task('connect', function() {
  return connect.server({
    root: './dist',
    port: 9999,
    host: 'localhost',
    livereload: true
  })
})

gulp.task('watch', function() {
  gulp.watch('./src/html/**/*.jade', gulp.series('template'))
  return gulp.watch('./src/html/styles/**/*.styl', gulp.series('styles'))
})

gulp.task('default', gulp.series(
  gulp.parallel('clean-dist', 'clean-tmp'),
  gulp.parallel('template', 'styles', 'images', 'vendors', 'modules', 'fonts'),
  gulp.parallel('connect', 'watch')
))


gulp.task('build-styles', function() {
  return gulp.src('./src/html/styles/**/*.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: [
        require('nib')(),
        require('rupture')()
      ],
      compress: true
    }))
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('./dist/styles'))
})

gulp.task('robots', function() {
  return gulp.src('./src/html/robots.txt')
    .pipe(replace('__URL__', config.url))
    .pipe(gulp.dest('./dist'))
})

gulp.task('sitemap', function() {
  return gulp.src('./src/sitemap.xml')
    .pipe(gulp.dest('./dist'))
})

gulp.task('build', gulp.series(
  gulp.parallel('clean-dist', 'clean-tmp'),
  gulp.parallel('template', 'styles', 'images', 'vendors', 'modules', 'fonts', 'build-styles', 'images', 'fonts', 'robots', 'sitemap')
))
