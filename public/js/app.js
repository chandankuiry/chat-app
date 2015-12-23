var socket =io();
//for server connection
socket.on('connect', function () {
	console.log('Connected to socket.io server');
});
//to listen the message what we sent
socket.on('message', function (message) {
	console.log('New message');
	console.log(message.text);

	jQuery('.messages').append('<p>' + message.text +'</p>');
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
		text:$message.val()
		//here we use find method to find input whose name=message and val()  we used to pull out the message as string
		
	});
	//to erase the message from input field after submitting
	$message.val('');//we set to a empty string 

});