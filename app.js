// Generated by CoffeeScript 1.4.0
(function() {
  var app, express, http, io, path, server, twitter;

  express = require('express');

  http = require('http');

  path = require('path');

  twitter = require('ntwitter');

  app = express();

  twitter = new twitter({
    consumer_key: 'Low3PcJyjizgUtVpsufS3Q',
    consumer_secret: 'pei8KmfwAoShza3pMLmVCuFZEE5QFbvulWG4RdaLFWM',
    access_token_key: '115662569-4Lm7AUI7Tq8ev4YkWsBVMRda1RQE7u9ayHSQq7RI',
    access_token_secret: 'dw2iVSpFVPz6ix6KLIz50W2uOuB0MS5iP7ot9f0NUQ'
  });

  app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
      secret: "hogesecret"
    }));
    app.use(app.router);
    return app.use(express["static"](path.join(__dirname, 'public')));
  });

  app.configure('development', function() {
    return app.use(express.errorHandler());
  });

  server = require('http').createServer(app).listen(app.get('port'), function() {
    return console.log("Express server listening on port " + app.get('port'));
  });

  io = require('socket.io').listen(server, {
    'log level': 1
  });

  app.get('/', function(req, res) {
    res.render('main', {});
    return twitter.stream('statuses/sample', function(stream) {
      stream.on('data', function(data) {
        return io.sockets.emit('stream', data);
      });
      stream.on('end', function(response) {
        return console.log('end');
      });
      return stream.on('destroy', function(response) {
        return console.log('destroy');
      });
    });
  });

  this;


}).call(this);
