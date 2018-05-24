#!/usr/bin/env nodemon

var fs = require('fs');
var path = require('path');
var express = require('express');
var ws = require('ws');

var app = express()
app.use(express.static(__dirname + '/'));
app.listen(8000);
console.log('Aponte seu navegador para https://localhost:8000/');

var repl = require('repl');
var rinst = repl.start('> ');
rinst.context.app = app

var wsock = new ws.Server({
    port: 9000
});

wsock.broadcast = function broadcast(data) {
    wsock.clients.forEach(function each(client) {
        client.send(data);
    });
};
 
wsock.on('connection', function(wsk) {
    wsk.on('message', function(msg) {
        data = JSON.parse(msg);
        if (data.mensagem) wsock.broadcast('<strong>' + data.nome + 
				'</strong>: ' + data.mensagem);
    });
});
