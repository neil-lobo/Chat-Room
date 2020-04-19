var socket;
var name;
var connections = [];

function setup()
{
	var url = getURL();
	name = url.slice(url.indexOf("?name=") + 6);

	socket = io.connect();

	socket.emit("update_name", {
		"name": name
	});

	socket.on("set_name", function(data) {
		name = data.name;
	});

	socket.on("set_connections", function(data)
	{
		connections = [];
		for(let i = 0; i < data.connections.length; i++)
		{
			connections[i] = data.connections[i];
		}
	});

	createCanvas(500,500);
}

function draw()
{
	socket.emit("get_name");
	socket.emit("get_connections");

	background(51);
}