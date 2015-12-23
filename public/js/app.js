var socket =io();
//for server connection
socket.on('connect', function () {
	console.log('Connected to socket.io server');
});
//to listen the message what we sent
socket.on('message', function (message) {
	console.log('New message');
	console.log(message.text);
});