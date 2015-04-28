var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');
var search = require('./routes/search');
var champions = require('./routes/champions');
var runes = require('./routes/runes');
var masteries = require('./routes/masteries');
var recentGames = require('./routes/recentGames');
var currentGame = require('./routes/currentGame');
var mongoose = require('mongoose');
var fs = require('fs');
var Summoners = require('./models/summoners');
var app = express();

mongoose.connect('mongodb://localhost/test');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/search', search);
app.use('/champions', champions);
app.use('/runes', runes);
app.use('/masteries', masteries);
app.use('/recent', recentGames);
app.use('/current', currentGame);

app.use(function(req, res, next) {
  req.headers['if-none-match'] = 'no-match-for-this';
  next();    
});
app.get('/summoners', function(req, res){
   Summoners.find(function(err, summoners){
       res.send(summoners);
   });
});
app.get('/summoners/:username', function(req, res){
   Summoners.find({username: req.params.username}, function(err, summoners){
       res.send(summoners);
   });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
// module.exports = app;
