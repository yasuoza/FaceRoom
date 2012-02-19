"use strict";

var express = require('express'),
    RedisStore = require('connect-redis')(express),
    UserModel = require('./model/user'),
    Room = require('./model/room'),
    mongoose = require('mongoose'),
    messages = require('./middleware/locals'),
    config = require('./conf/config');

var app = express.createServer();


// Catch All exception handler
process.on('uncaughtException', function (err) {
    console.log('Uncaught exception: ' + err + err.stack);
});

// middleware configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view options', {layout: false});
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieParser(config.cookie.secret));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
        secret: config.cookie.secret,
        store: new RedisStore,
        cookie: {
            maxAge: config.cookie.maxAge,
            httpOnly: config.cookie.httpOnly
        }
    }));
    app.use(messages);
    app.use(app.router);
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

// DB
mongoose.connect(config.db.type + '://' + config.db.host + '/' + config.db.dbname, function (err) {
    if(err){
        console.log(err);
    }else{
        console.log('MongoDB connection success!');
    }
});


// Routes
require('./routes/home')(app);
require('./routes/login')({
    app: app,
    config: config
});
require('./routes/newroom')({
    app: app,
    config: config
});
require('./routes/room')({
    app: app,
    config: config
});
app.get('*', function(req, res){
    res.render('404');
});

// Start app server
app.listen(config.http.back_port);
console.log('Server running at http://' + config.http.host + ':' + config.http.back_port + '/');
