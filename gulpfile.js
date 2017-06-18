'use strict';

var gulp = require('gulp'); // task runner
var connect = require('gulp-connect'); // runs local dev server
var open = require('gulp-open'); // opens a url in a Web browser
var eslint = require('gulp-eslint'); // Lint JS files + jsx files
var browserify = require('browserify'); // bundles the javascript
var reactify = require('reactify'); // transforms reach JSX to JS
var source = require('vinyl-source-stream'); // use conventional text streams with Gulp
var concat = require('gulp-concat'); // concatenates files
var docco = require('gulp-docco'); // generates docs

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        mainJS: './src/main.js',
        dist: './dist',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ]
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
        .pipe(open({
            uri: config.devBaseUrl + ':' + config.port + '/'
        }));

});

// copies html files to dist folder
gulp.task('html', function () {
   gulp.src(config.paths.html)
       .pipe(gulp.dest(config.paths.dist))
       .pipe(connect.reload());
});

gulp.task('js', function () {
    browserify(config.paths.mainJS)
        .transform(reactify)
        .bundle() // bundle all JS files
        .on('error', console.log.bind(console)) //print any errors
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
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

// Generate documentation pages and save into `docs` directory.
gulp.task('docs', function () {
    return gulp.src(config.paths.js)
        .pipe(docco())
        .pipe(gulp.dest('docs'));
});

// file watcher
gulp.task('watch', function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

// add default task to be run when typing gulp
gulp.task('default', ['html', 'js', 'css', 'lint', 'docs', 'open', 'watch']);