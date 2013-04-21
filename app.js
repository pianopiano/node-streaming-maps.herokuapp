/**
 * Module dependencies.
 */

var express = require('express')
,	http = require('http')
,	path = require('path')
,	twitter = require('ntwitter')
,	app = express()
,	twitter = new twitter({
		consumer_key: 'XZT6n42ME1lGA4LEGSNcQ',
		consumer_secret: 'wSDG5LMe4yWpoQtqLN26Qf0A9nZFAcc3bUJK860FnA',
		access_token_key: '115662569-sGbpukDgOnKJNsJ1PVe3fBSWw9qJmx7vq7XXZQqy',
		access_token_secret: 'osZes8wHl9eW7Qx9glCcVMztCQsmShYRhVl3qyCww'
});


app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({secret: "hogesecret"}));
	//app.use(passport.initialize());
	//app.use(passport.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

var server=require('http').createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
var io=require('socket.io').listen(server, {'log level':1});
app.get('/', function(req, res){
	res.render('main', {});
	twitter.stream('statuses/sample',function(stream) {
		stream.on('data', function (data) {
			io.sockets.emit('stream',data);
		});
		stream.on('end', function (response) {
			alert('end')
		});
		stream.on('destroy', function (response) {
			alert('destroy')
		});
	});
});


