var socket =io();
//for server connection
socket.on('connect', function () {
	console.log('Connected to socket.io server');
});