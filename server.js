var PORT = process.env.PORT || 3000;
var moment=require('moment');
var express = require('express');
var app = express();
var http= require('http').Server(app);
var io=require('socket.io')(http);//it is method to define socket

app.use(express.static(__dirname +'/public'));
var clientInfo={};//this variable is created for generate the unique key value pair for chat Room
// it tells that user connected
io.on('connection', function (socket) {
	console.log('User connected via socket.io!');
	//server side connection for joining a particular room
	socket.on('joinRoom', function (req) {
		//for generate unique key value pair according to socket.id who join this room
		clientInfo[socket.id] =req;//we use =req for who request to join chat room and use [] for dynamic data
		//socket.join is a specific method to join a particular room
		socket.join(req.room);//req.room for room name
		//we can send everyone that new one can join the room by following code
		socket.broadcast.to(req.room).emit('message',{//(req.room) for only the people of that room can see the message
			name:'System',
			text:req.name + ' has joined this room!',//to see the name who joined
			timestamp: moment().valueOf()//to see the message when join the room
		}); 
	});

	//for typing message and send to everyone from server in server also seen 
	socket.on('message', function (message) {
		console.log('Message Received:  ' +message.text);
		//for sending everyone or we say everyone can see messages excluding sender
		//socket.broadcast.emit('message',message);
		//TO SEE THE TIME WE USE MOMENTJS PROPERTY
		message.timestamp=moment().valueOf();//see moment-example.js
		// sender can also see the message using io.emit and this case everyone also can see the received message
		//io.emit('message',message);
		//for chat room only can see the message who join chat room
		io.to(clientInfo[socket.id].room).emit('message',message);
	});
	//for sending everyone
	socket.emit('message',{
		name:'System',
		text:'Welcome to Chat Application !',
		timestamp:moment().valueOf()
	});

});

http.listen(PORT, function () {
	console.log("server started !");
});