var pkg = require('./package.json');
var fs = require('fs');

module.exports = {
  dist: 'dist',

  banner:
  '/*!\n' +
  ' * Copyright 2016 Thinking Bytes Ltd.\n' +
  ' *\n' +
  ' * ngChatScroller, v<%= pkg.version %>\n' +
  ' * Smooth Chat based scrolling for Angular.\n' +
  ' * http://angularjs.org/\n' +
  ' *\n' +
  ' * By @arolave <3\n' +
  ' *\n' +
  ' * Licensed under the MIT license. Please see LICENSE for more information.\n'+
  ' *\n' +
  ' */\n\n',

  //Exclamation can be no longer than 14 chars
  exclamations: [
    "Aah","Ah","Aha","All right","Aw","Ay","Aye","Bah","Boy","By golly","Boom","Cheerio","Cheers","Come on","Crikey","Dear me","Egads","Fiddle-dee-dee","Gadzooks","Gangway","G'day","Gee whiz","Gesundheit","Get outta here","Gosh","Gracious","Great","Gulp","Ha","Ha-ha","Hah","Harrumph","Hey","Hooray","Hurray","Huzzah","I say","Look","Look here","Long time","Lordy","Most certainly","My my","My word","Oh","Oh-oh","Oh no","Okay","Okey-dokey","Ooh","Oye","Phew","Quite","Ready","Right on","Roger that","Rumble","Say","See ya","Snap","Sup","Ta-da","Take that","Tally ho","Thanks","Toodles","Touche","Tut-tut","Very nice","Very well","Voila","Vroom","Well done","Well, well","Whoa","Whoopee","Whew","Word up","Wow","Wuzzup","Ya","Yea","Yeah","Yippee","Yo","Yoo-hoo","You bet","You don't say","You know","Yow","Yum","Yummy","Zap","Zounds","Zowie"
  ]

};
