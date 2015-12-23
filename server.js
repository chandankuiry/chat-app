var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http= require('http').Server(app);
var io=require('socket.io')(http);//it is method to define socket

app.use(express.static(__dirname +'/public'));
// it tells that user connected
io.on('connection', function () {
	console.log('User connected via socket.io!');
});

http.listen(PORT, function () {
	console.log("server started !");
});