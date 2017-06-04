'use strict';

var gulp = require('gulp'); // task runner
var connect = require('gulp-connect'); // runs local dev server
var open = require('gulp-open'); // opens a url in a Web browser
var lint = require('gulp-eslint'); // Lint JS files + jsx files

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        dist: './dist'
    }
};

// starts local dev server
gulp.task('connect', function () {
   connect.server({
       root: ['dist'],
       port: config.port,
       base: config.devBaseUrl,
       livereload: true
   })
});

// opens URl in browser
gulp.task('open',['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

// copies html files to dist folder
gulp.task('html', function () {
   gulp.src(config.paths.html)
       .pipe(gulp.dest(config.paths.dist))
       .pipe(connect.reload());
});

gulp.task('css', function () {
   gulp.src(config.paths.css)
       .pipe(concat('bundle.css'))
       .pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('lint', function () {
 return gulp.src(config.paths.js)
     .pipe(eslint({config: 'eslint.config.json'}))
     .pipe(eslint.format());
});

// file watcher
gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
});

// add default task to be run when typing gulp
gulp.task('default', ['html', 'open', 'watch']);