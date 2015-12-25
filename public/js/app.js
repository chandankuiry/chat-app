var name=getQueryVariable('name') || 'Anonymous user';
var room=getQueryVariable('room')
var socket =io();

console.log(name + '  wants to join ' + room);
//udate room tag h1
jQuery('.room-title').text(room);
//for server connection
socket.on('connect', function () {
	console.log('Connected to socket.io server');
	//here define user can specific join a room
	socket.emit('joinRoom', {
		name:name,//to specify a name
		room:room//to specify a room name
	});
});
//to listen the message what we sent
socket.on('message', function (message) {
	var momentTimestamp =moment.utc(message.timestamp)
	var $message = jQuery('.messages');
	console.log('New message');
	console.log(message.text);

	$message.append('<p><strong>' + message.name + ' '+' ' +momentTimestamp.local().format('h:mm a')+ '</strong></p>');
	$message.append('<p>'+ message.text+'</p>');
});
//HANDLE SUBMITTING FOR NEW MESSAGE
var $form =jQuery('#message-form');//here $ we use access jquery element
//and inside jquery we type the id attributes see index.html and we have to use # 
$form.on('submit' , function (event){
	event.preventDefault();
	//preventDefault is use to ignore refreshing page to submit
	$message =$form.find('input[name=message]');//we use this twice so it saved in a variable
	//sending message to server
	socket.emit('message' ,{
		name:name,
		text:$message.val()
		//here we use find method to find input whose name=message and val()  we used to pull out the message as string
		
	});
	//to erase the message from input field after submitting
	$message.val('');//we set to a empty string 

});