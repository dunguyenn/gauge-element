gulp = require 'gulp'
gutil = require 'gulp-util'
connect = require 'gulp-connect'
concat = require 'gulp-concat'
sass = require 'gulp-sass'
coffee = require 'gulp-coffee'
sourcemaps = require 'gulp-sourcemaps'

path =
  src: './src'
  dist: './dist'

gulp.task 'coffee', ->
  gulp.src path.src + '/**/*.coffee'
  .pipe sourcemaps.init()
  .pipe coffee({ bare: true }).on('error', gutil.log)
  .pipe sourcemaps.write('.')
  .pipe gulp.dest path.dist
  .pipe connect.reload()

gulp.task 'sass', ->
  gulp.src path.src + '/**/*.scss'
  .pipe sourcemaps.init()
  .pipe sass().on('error', gutil.log)
  .pipe sourcemaps.write('.')
  .pipe gulp.dest path.dist
  .pipe connect.reload()

gulp.task 'html', ->
  gulp.src path.src + '/**/*.html'
  .pipe gulp.dest path.dist
  .pipe connect.reload()


gulp.task 'watch', ->
  gulp.watch path.src + '/**/*.coffee', ['coffee']
  gulp.watch path.src + '/**/*.scss', ['sass']
  gulp.watch path.src + '/**/*.html', ['html']

gulp.task 'server', ->
  connect.server
    port: 3000
    livereload: true

gulp.task 'build', ['coffee', 'sass', 'html']

gulp.task 'default', ['build', 'server', 'watch']
