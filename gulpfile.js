var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  del = require('del'),
  minimist = require('minimist'),
  browserSync = require('browser-sync');

var SRC = 'src',
  DST = 'build';

var args = minimist(process.argv.slice(2), {
  strings: ['env'],
  default: {'env': 'prod'}
});

var config = {
  'ENV_WEB_PROTOCOL': {'dev': 'http', 'prod': 'https'},
  'ENV_WEB_PORT': {'dev': 9001, 'prod': 9002},
  'ENV_WEB_HOST': {'dev': 'localhost', 'prod': 'tracer.arcs.co'},
  'ENV_DB_PROTOCOL': {'dev': 'http', 'prod': 'https'},
  'ENV_DB_PORT': {'dev': 5984, 'prod': 5984},
  'ENV_DB_HOST': {'dev': 'localhost', 'prod': 'tracer-db.arcs.co'}
};


function clean(done) {
  return del(DST, done);
}

function reload(stream) {
  return browserSync.reload({stream: stream});
}

function css() {
  return gulp.src(SRC + '/styles/*.css')
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.minifyCss())
    .pipe(gulp.dest(DST + '/styles'))
    .pipe(reload(true));
}

function images() {
  return gulp.src(SRC + '/images/*.{jpg,gif,png,svg}')
    .pipe(gulp.dest(DST + '/images'))
    .pipe(reload(true));
}

var src = gulp.series(gulp.parallel(
  function src_bower_components() {
    return gulp.src(SRC + '/bower_components/**/*')
      .pipe(gulp.dest(DST + '/bower_components'));
  },
  function src_index() {
    return gulp.src(SRC + '/index.html')
      .pipe($.preprocess({
        context: config
      }))
      .pipe($.minifyHtml())
      .pipe(gulp.dest(DST))
  },
  function src_elements() {
    var dest = DST + '/elements';
    if (args.env === 'prod') {
      // Vulcanise
      return require('merge-stream')(
        gulp.src(SRC + '/elements/**/*.{html,js}')
          .pipe($.filter('elements.html'))
          .pipe($.vulcanize({
            dest: dest,
            strip: true,
            csp: true,
            inline: true
          }))
          // Have to replace after vulcanisation as vulcanise seems to reference original files, not those in stream.
          .pipe($.renvy(config, args.env))
          .pipe(gulp.dest(dest)),
        gulp.src(SRC + '/elements/**/*.!(html|css|js)')
          // Vulcanize screws up resource paths for some reason, so transpose them to match.
          .pipe(gulp.dest(DST + '/src/elements'))
      );
    } else {
      // Just copy sources
      return gulp.src(SRC + '/elements/**/*')
        .pipe($.renvy(config, args.env))
        .pipe(gulp.dest(dest));
    }
  }), function(done) {
  reload(false);
  done();
});

function watch() {
  gulp.watch(SRC + '/styles/*.css', css);
  gulp.watch(SRC + '/images/*.{jpg,gif,png,svg}', images);
  gulp.watch([SRC + '/index.html', SRC + '/elements/**/*'], src);
}

function serve() {
  browserSync({
    server: {
      baseDir: DST
    },
    open: false
  });
}


gulp.task('clean', clean);

gulp.task('build', gulp.series(clean, gulp.parallel(src, css, images)));

gulp.task('watch', gulp.series('build', watch));

gulp.task('serve', gulp.series('build', gulp.parallel(watch, serve)));

gulp.task('default', gulp.series('build'));
