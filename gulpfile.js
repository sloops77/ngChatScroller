var buildConfig = require('./build.config.js');
var conventionalChangelog = require('gulp-conventional-changelog');
var conventionalGithubReleaser = require('conventional-github-releaser');
var git = require('gulp-git');
var gulp = require('gulp');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
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
                from: from,
                preset: 'angular',
              }, function(err, log) {
      if (err) reject(err);
      else resolve(log);
    });
  });
}

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

gulp.task('changelog', function () {
    return gulp.src('CHANGELOG.md', {
        buffer: false
    })
        .pipe(conventionalChangelog({
                                        preset: 'angular' // Or to any other commit message convention you use.
                                    }))
        .pipe(gulp.dest('./'));
});

gulp.task('github-release', function(done) {
    conventionalGithubReleaser({
                                   type: "oauth",
                                   token: process.env.GH_TOKEN
                               }, {
                                   preset: 'angular' // Or to any other commit message convention you use.
                               }, done);
});

gulp.task('release', function (done) {
    runSequence(
        'version',
        'changelog',
        'commit-changes',
        'push-changes',
        'create-new-tag',
        'github-release',
        function (error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('RELEASE FINISHED SUCCESSFULLY');
            }
            done(error);
        });
});


gulp.task('commit-changes', function () {
    return gulp.src('.')
        .pipe(git.add())
        .pipe(git.commit('[Prerelease] Bumped version number'));
});

gulp.task('push-changes', function (cb) {
    git.push('origin', 'master', cb);
});

gulp.task('create-new-tag', function (cb) {
    git.tag(version, 'Created Tag for version: ' + pkg.version, function (error) {
        if (error) {
            return cb(error);
        }
        git.push('origin', 'master', { args: '--tags' }, cb);
    });
});

function pad(n) {
  if (n<10) { return '0' + n; }
  return n;
}
