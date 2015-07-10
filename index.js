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

// Send the style sheet files
app.get('/Content/(*/?)*', function(req, res) {
    res.sendfile(__dirname + req.path)
});

//req.body.hasOwnProperty('author')

// Send the script files
app.get('/(*/?)*', function(req, res) {
    res.sendfile(__dirname + '/layout.html')
});

rest.build(app);
// // Send the script files
// app.get('/js/(*/?)*', function(req, res) {
//     res.sendfile(__dirname + req.path.replace('/js/', '/Content/Scripts/'))
// });
//
// // Send the style sheet files
// app.get('/css/(*/?)*', function(req, res) {
//     res.sendfile(__dirname + req.path.replace('/css/', '/Content/Styles/'))
// });
//
// // Send the images
// app.get('/img/(*/?)*', function(req, res) {
//     res.sendfile(__dirname + req.path.replace('/img/', '/Content/images/'))
// });
//
// // Send the template html.
// app.get('/', function(req, res) {
//     res.sendfile(__dirname + '/layout.html')
// });

/* SOCKET HANDLERS */

// app.io.route('Client:addPlayer', function(req) {
//     req.io.broadcast('Server:addPlayer', req.data)
// });

// app.io.route('Client:refreshPlayer', function(req) {
//     req.io.broadcast('Server:refreshPlayer', req.data)
// });

app.listen(7076);

/*function handler(req, res) {
	if (req.url.indexOf('.js') > -1 || req.url.indexOf('/img/') > -1) {
		fs.readFile(__dirname + req.url,
	  	function (err, data) {
	    	if (err) {
	      		res.writeHead(500);
	      		return res.end('Error loading index.html');
	    	}
	    	res.writeHead(200);
	    	res.end(data);
		});
	} else {
		fs.readFile(__dirname + '/page/index.html',
	  	function (err, data) {
	    	if (err) {
	      		res.writeHead(500);
	      		return res.end('Error loading index.html');
	    	}
	    	res.writeHead(200);
	    	res.end(data);
		});
	}
}*/
