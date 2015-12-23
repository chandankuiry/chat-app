var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http= require('http').Server(app);
var io=require('socket.io')(http);//it is method to define socket

app.use(express.static(__dirname +'/public'));
// it tells that user connected
io.on('connection', function (socket) {
	console.log('User connected via socket.io!');

	//for typing message and send to everyone from server in server also seen 
	socket.on('message', function (message) {
		console.log('Message Received:  ' +message.text);
		//for sending everyone or we say everyone can see messages excluding sender
		//socket.broadcast.emit('message',message);
		// sender can also see the message using io.emit and this case everyone also can see the received message
		io.emit('message',message);
	});
	//for sending everyone
	socket.emit('message',{
		text:'Welcome to Chat Application !'
	});

});

http.listen(PORT, function () {
	console.log("server started !");
});