var Promise = require('bluebird');
var express = require('express');
var morgan = require('morgan');
var request = require('request');

var config = require('./config/main');
var slack = require('./services/slack');
var socket = require('./services/socket');
var parrot = require('./bots/parrot');

slack.rtm.start(config.token).then(function(res) {
    socket.connect(res.url);
    socket.on('message', function (message) {
        setImmediate(function () {
            parrot.dispatch(message);
        });
    });
});

var app = express();
app.use(morgan('tiny'));

require('./controllers/web')(app);

app.listen(config.port, config.host, function() {
    console.log('Listening on ' + config.host + ':' + config.port);
    setInterval(function() {
        request(config.url);
    }, 600000);
});
