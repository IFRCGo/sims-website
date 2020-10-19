var gulp = require('gulp');
var cp = require('child_process');
var clean = require('gulp-clean');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence').use(gulp);
var concat = require('gulp-concat');
var fs = require('fs');
var request = require('request');


// Copy from the .tmp to _site directory.
// To reduce build times the assets are compiles at the same time as jekyll
// renders the site. Once the rendering has finished the assets are copied.
gulp.task('copy:assets', function(done) {
  return gulp.src('.tmp/assets/**')
    .pipe(gulp.dest('_site/assets'))
});


// vendor styles
gulp.task('styles', function() {
  
  var stylesSrc = [
        './node_modules/bootstrap/dist/css/bootstrap.css',
        './node_modules/font-awesome/css/font-awesome.css',
        './node_modules/blueimp-gallery/css/blueimp-gallery.css',
        './node_modules/dc/dc.css'
      ]
      
  return gulp.src(stylesSrc)
  // .pipe(cleanCSS({compatibility: 'ie9', rebase: false}))
  .pipe(concat('vendor.min.css'))
  .pipe(gulp.dest('.tmp/assets/styles'))

});

gulp.task('fonts', function() {
  gulp.src('./node_modules/font-awesome/fonts/**.*')
    .pipe(gulp.dest('.tmp/assets/fonts'));
    
});

// vendor scripts
gulp.task('bootstrap', function() {
  return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
    .pipe(gulp.dest('.tmp/assets/scripts'));
});
gulp.task('jquery', function() {
  return gulp.src('./node_modules/jquery/dist/jquery.min.js')
    .pipe(gulp.dest('.tmp/assets/scripts'));
});
gulp.task('d3', function() {
  gulp.src('./node_modules/d3/d3.min.js')
    .pipe(gulp.dest('.tmp/assets/scripts'));
});
gulp.task('blueimp', function() {
  gulp.src('./node_modules/blueimp-gallery/js/blueimp-gallery.min.js')
    .pipe(gulp.dest('.tmp/assets/scripts'));
});
gulp.task('tabletop', function() {
  return gulp.src('./node_modules/tabletop/src/tabletop.min.js')
    .pipe(gulp.dest('.tmp/assets/scripts'));
});
gulp.task('dc', function() {
  gulp.src('./node_modules/dc/dc.min.js')
    .pipe(gulp.dest('.tmp/assets/scripts'));
});
gulp.task('scripts', function(done) {
  runSequence(['bootstrap', 'jquery', 'd3', 'blueimp', 'tabletop', 'dc'], done);
});




// Build the jekyll website.
gulp.task('jekyll', function (done) {
  var args = ['exec', 'jekyll', 'build'];

  switch (environment) {
    case 'development':
      args.push('--config=_config.yml,_config-dev.yml');
    break;
    case 'production':
      args.push('--config=_config.yml');
    break;
  }

  return cp.spawn('bundle', args, {stdio: 'inherit'})
    .on('close', done);
});

// Build the jekyll website.
// Reload all the browsers.
gulp.task('jekyll:rebuild', ['jekyll'], function () {
  browserSync.reload();
});

gulp.task('build', function(done) {
  runSequence(['jekyll', 'scripts', 'styles', 'fonts'], ['copy:assets'], done);
});

// Default task.
gulp.task('default', function(done) {
  runSequence('build', done);
});

gulp.task('serve', ['build'], function () {
  browserSync({
    port: 3000,
    server: {
      baseDir: ['.tmp', '_site']
    }
  });

  gulp.watch(['./app/assets/scripts/*.js', './app/assets/styles/*.css'], function() {
    runSequence('jekyll', 'copy:assets', browserReload);
  });

  gulp.watch(['app/**/*.html', 'app/**/*.md', '_config*'], function() {
    runSequence('jekyll', 'copy:assets', browserReload);
  });

});

var shouldReload = true;
gulp.task('no-reload', function(done) {
  shouldReload = false;
  runSequence('serve', done);
});

var environment = 'development';
gulp.task('prod', function(done) {
  environment = 'production';
  runSequence('clean', 'build', 'get-humans', done);
});

// Removes jekyll's _site folder
gulp.task('clean', function() {
  return gulp.src(['_site', '.tmp'], {read: false})
    .pipe(clean());
});


// Helper functions 
// ----------------

function browserReload() {
  if (shouldReload) {
    browserSync.reload();
  }
}


// Humans task 
// -----------

gulp.task('get-humans', function(){

  var getHumans = function(callback){
    var options = {
      url: 'https://api.github.com/repos/AmericanRedCross/sims-website/contributors',
      headers: {
        'User-Agent': 'request'
      }
    };

    request(options, function (err, res) {
      var humans = JSON.parse(res.body).map(function(human){
        return {login: human.login, html_url: human.html_url, contributions: human.contributions}
      });
      humans.sort(function(a,b){
        return b.contributions - a.contributions;
      })
      callback(humans);
    });
  }

  getHumans(function(humans){
    fs.readFile('./app/assets/data/humans-tmpl.txt', 'utf8', function (err, doc) {
      if (err) throw err;
      for (i = 0; i < humans.length; i++) {
        doc = doc + '\nContributor: '+humans[i].login + '\nGithub: '+humans[i].html_url +'\n';
      }
      fs.writeFile('./app/humans.txt', doc, function(err) {
        if (err) throw err;
      });
    });
  });
});
