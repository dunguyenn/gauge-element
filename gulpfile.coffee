gulp = require 'gulp'
gutil = require 'gulp-util'
connect = require 'gulp-connect'
concat = require 'gulp-concat'
sass = require 'gulp-sass'
coffee = require 'gulp-coffee'
sourcemaps = require 'gulp-sourcemaps'

gulp.task 'coffee', ->
  gulp.src ['./src/**/*.coffee']
  .pipe sourcemaps.init()
  .pipe coffee({ bare: true }).on('error', gutil.log)
  .pipe sourcemaps.write()
  .pipe gulp.dest './dist'
  .pipe connect.reload()

gulp.task 'sass', ->
  gulp.src ['./src/**/*.scss']
  .pipe sourcemaps.init()
  .pipe sass().on('error', gutil.log)
  .pipe sourcemaps.write()
  .pipe gulp.dest './dist'
  .pipe connect.reload()

gulp.task 'html', ->
  gulp.src ['./src/**/*.html']
  .pipe gulp.dest './dist'
  .pipe connect.reload()


gulp.task 'watch', ->
  gulp.watch ['./src/**/*.coffee'], ['coffee']
  gulp.watch ['./src/**/*.scss'], ['sass']
  gulp.watch ['./src/**/*.html'], ['html']

gulp.task 'server', ->
  connect.server
    port: 3000
    livereload: true

gulp.task 'build', ['coffee', 'sass', 'html']

gulp.task 'default', ['build', 'server', 'watch']
