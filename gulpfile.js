var buildConfig = require('./build.config.js');
var changelog = require('conventional-changelog');
var GithubApi = require('github');
var gulp = require('gulp');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var template = require('gulp-template');

/**
 * Load Test Tasks
 */
gulp.task('changelog', function() {
  var dest = argv.dest || 'CHANGELOG.md';
  var toHtml = !!argv.html;
  return makeChangelog(argv).then(function(log) {
    if (toHtml) {
      log = marked(log, {
        gfm: true
      });
    }
    fs.writeFileSync(dest, log);
  });
});

function makeChangelog(options) {
  var file = options.standalone ? '' : __dirname + '/CHANGELOG.md';
  var subtitle = options.subtitle || '';
  var from = options.from;
  var version = options.version || pkg.version;
  return new Promise(function (resolve, reject) {
    changelog({
                repository: 'https://github.com/sloops77/ngChatScroller',
                version: version,
                subtitle: subtitle,
                file: file,
                from: from
              }, function(err, log) {
      if (err) reject(err);
      else resolve(log);
    });
  });
}

gulp.task('release', [
  'version',
  'release-github'
]);

gulp.task('version', function() {
  var d = new Date();
  var date = d.toISOString().substring(0,10);
  var time = pad(d.getUTCHours()) +
      ':' + pad(d.getUTCMinutes()) +
      ':' + pad(d.getUTCSeconds());
  return gulp.src('version.template.json')
      .pipe(template({
                       pkg: pkg,
                       date: date,
                       time: time
                     }))
      .pipe(rename('version.json'))
      .pipe(gulp.dest(buildConfig.dist));
});

gulp.task('release-github', function(done) {
  var github = new GithubApi({
    version: '3.0.0'
  });
  github.authenticate({
    type: 'oauth',
    token: process.env.GH_TOKEN
  });
  makeChangelog({
    standalone: true
  })
    .then(function(log) {
      var version = 'v' + pkg.version;
      github.releases.createRelease({
        owner: 'sloops77',
        repo: 'ngChatScroller',
        tag_name: version,
        name: 'ngChatScroller-' + version,
        body: log
      }, done);
    })
    .catch(done);
});

function pad(n) {
  if (n<10) { return '0' + n; }
  return n;
}
