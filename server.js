var PORT = process.env.PORT || 3000;
var moment=require('moment');
var express = require('express');
var app = express();
var http= require('http').Server(app);
var io=require('socket.io')(http);//it is method to define socket

app.use(express.static(__dirname +'/public'));
var clientInfo={};//this variable is created for generate the unique key value pair for chat Room
//it tells the @currentuser command see below which return all the active user on that room
function sendCurrentUsers (socket) {
	var info=clientInfo[socket.id];
	var users=[];//to store all the currrent user on that room
	//check userid is correct or not
	if (typeof info === 'undefined') {
		return;
	} 
	//it return all the current user .we use here builtin method 'Object.keys'
	Object.keys(clientInfo).forEach(function (socketId) {
		var userInfo =clientInfo[socketId];//here we store the socketId for 
		//checking that user in that room in next level
		//to check the userInfo is from that room or not
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}  
	});
	//for return current user
	socket.emit('message' , {
		name:'System' ,
		//here we use users.join which convert all the array element convert 
		//to a string and push them together and (, ) it return all the users like chandan, ben ,.. 
		text:'current users are : ' + users.join(', '),
		timestamp:moment().valueOf() 
	});
}
// it tells that user connected
io.on('connection', function (socket) {
	console.log('User connected via socket.io!');
	//for disconnect from a chat room means leave achat room
	//here we use builtin event call 'disconnect'
	socket.on('disconnect', function (){
		//we have to use clientInfo[socket.id] many times so we assign this in a variable
		userData=clientInfo[socket.id];
		//check if the userid is from that chat room
		if (typeof userData !== 'undefined') {
			//for leaveing a chat room
			socket.leave(userData.room);//'leave' is just like 'join' 
			//to leave a message that someone leave that chat room 
			io.to(userData.room).emit('message' ,{
				name:'System',
				text: userData.name + ' has left this chat room !',
				timestamp:moment().valueOf()

			});
			delete userData;

		}
	});
	//server side connection for joining a particular room "joinRoom builtin socketio event"
	socket.on('joinRoom', function (req) {
		//for generate unique key value pair according to socket.id who join this room
		clientInfo[socket.id] =req;//we use =req for who request to join chat room and use [] for dynamic data
		//socket.join is a specific method to join a particular room
		socket.join(req.room);//req.room for room name
		//we can send everyone that new one can join the room by following code
		socket.broadcast.to(req.room).emit('message',{//(req.room) for only the people of that room can see the message
			name:'System',
			text:req.name + ' has joined this room!',//to see the name who joined
			timestamp:moment().valueOf()//to see the message when join the room
		}); 
	});

	//for typing message and send to everyone from server in server also seen 
	socket.on('message', function (message) {
		console.log('Message Received:  ' +message.text);
		//here we check if the message is @currentUsers command or not
		if (message.text === '@currentusers') {
			//this command run above function sendCurrentUsers
			sendCurrentUsers(socket);
		}else {
			//for sending everyone or we say everyone can see messages excluding sender
			//socket.broadcast.emit('message',message);
			//TO SEE THE TIME WE USE MOMENTJS PROPERTY
			message.timestamp = moment().valueOf(); //see moment-example.js
			// sender can also see the message using io.emit and this case everyone also can see the received message
			//io.emit('message',message);
			//for chat room only can see the message who join chat room
			io.to(clientInfo[socket.id].room).emit('message', message);
		}
		
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