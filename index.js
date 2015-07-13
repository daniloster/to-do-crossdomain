// # https://github.com/techpines/express.io/tree/master/examples#realtime-canvas
var express = require('express.io'),
app = express(),
rest = require('./rest/firebaseRest.js');
//var fs = require('fs');

// Setup your sessions, just like normal.
app.use(express.cookieParser())
app.use(express.session({
  secret: 'monk3y-t0do',
  key: 'todo-session-cors'
}));
app.use(express.bodyParser());


//app.http().io();
app.http();

// app.io.configure(function() {
//     app.io.enable('browser client minification');  // send minified client
//     app.io.enable('browser client gzip');          // gzip the file
//     app.io.set('log level', 1);                    // reduce logging
// });

/* HTTP HANDLERS */

app.use(function(req, res, next) {
  console.log(req.headers);
  console.log(req.headers.origin || req.headers.host);
  if (!!req.headers.origin) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, *");

  next();
});

// Send the style sheet files
app.get('/Content/(*/?)*', function(req, res) {
    res.sendfile(__dirname + req.path)
});

// Send the script files
app.get('/(*/?)*', function(req, res) {
    res.sendfile(__dirname + '/layout.html')
});

rest.build(app);
app.listen(7076);
// app.listen(process.env.PORT);
