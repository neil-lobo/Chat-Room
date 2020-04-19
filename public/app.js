var socket;
var name;

function setup()
{
	socket = io.connect();
	socket.on("set_name", function(data) {
		name = data.name;
	});

	createCanvas(500,500);
}

function draw()
{

	background(51);
}