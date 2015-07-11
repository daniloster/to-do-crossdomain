// # https://github.com/techpines/express.io/tree/master/examples#realtime-canvas
var express = require('express.io'),
app = express(),
rest = require('./rest/firebaseRest.js');
//var fs = require('fs');

// Setup your sessions, just like normal.
app.use(express.cookieParser())
app.use(express.session({secret: 'monk3y-t0do'}));
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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With, *");
  return next();
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
app.listen(process.env.PORT);
