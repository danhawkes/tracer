var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  merge = require('merge-stream'),
  minimist = require('minimist'),
  browserSync = require('browser-sync'),
  config = require('./gulpconfig');

var SRC = 'src',
  DST = 'build';

var args = minimist(process.argv.slice(2), {
  boolean: ['debug'],
  default: {'debug': false}
});

function clean(done) {
  return del(DST, done);
}

function css() {
  var filter = $.filter('**/*.css');
  return gulp.src(SRC + '/styles/**/*.*')
    .pipe(filter)
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.minifyCss())
    .pipe(filter.restore())
    .pipe(gulp.dest(DST + '/styles'))
    .pipe(browserSync.reload({stream: true}));
}

function images() {
  return gulp.src(SRC + '/images/*.{jpg,gif,png,svg}')
    .pipe(gulp.dest(DST + '/images'));
}

function src_bower_components() {
  return gulp.src(SRC + '/bower_components/**/*.*')
    // Heuristic to strip out all the cruft that comes with bower install. bower-installer
    .pipe($.filter([
      '**/*.{html,css,js}',
      '!**/{test,tests,doc,docs,demos,src,lib,bin}/**/*',
      '!**/demo.html'
    ]))
    .pipe(gulp.dest(DST + '/bower_components'));
}

function src_index() {
  return gulp.src(SRC + '/index.html')
    .pipe($.minifyHtml())
    .pipe(gulp.dest(DST))
}

function src_elements() {
  var dest = DST + '/elements';
  if (args.debug) {
    // Just copy sources
    var forGrep = $.filter('**/*.{html,css,js}');
    return gulp.src(SRC + '/elements/**/*')
      .pipe(forGrep)
      .pipe($.frep(config))
      .pipe(forGrep.restore())
      .pipe(gulp.dest(dest));
  } else {
    // Vulcanise
    return merge(
      gulp.src(SRC + '/elements/**/*.{html,js}')
        .pipe($.filter('elements.html'))
        .pipe($.vulcanize({
          dest: dest,
          strip: true,
          csp: true,
          inline: true
        }))
        // Have to replace after vulcanisation as vulcanise seems to reference original files, not those in
        // stream.
        .pipe($.frep(config))
        .pipe(gulp.dest(dest)),
      gulp.src(SRC + '/elements/**/*.!(html|css|js)')
        // Vulcanize screws up resource paths for some reason, so transpose them to match.
        .pipe(gulp.dest(DST + '/src/elements'))
    );
  }
}

function appcache(done) {
  if (args.debug) {
    done();
  } else {
    return gulp.src(DST + '/**/*.*', {base: DST})
      .pipe($.appcache({
        network: ['*'],
        filename: 'offline.appcache',
        hash: true
      }))
      .pipe(gulp.dest(DST));
  }
}

function watch() {
  gulp.watch(SRC + '/styles/*.css', css);
  gulp.watch(SRC + '/images/*.{jpg,gif,png,svg}', gulp.series(images, browserSync.reload));
  gulp.watch([SRC + '/index.html', SRC + '/elements/**/*'], gulp.series(gulp.parallel(src_bower_components, src_index, src_elements), browserSync.reload));
}

function serve() {
  browserSync({
    server: {
      baseDir: DST
    },
    ghostMode: false,
    ui: false,
    port: 80,
    open: false
  });
}

gulp.task('clean', clean);

gulp.task('build', gulp.series(clean, gulp.parallel(src_bower_components, src_index, src_elements, css, images), appcache));

gulp.task('serve', gulp.series('build', gulp.parallel(watch, serve)));

gulp.task('default', gulp.series('build'));
