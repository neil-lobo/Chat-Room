var socket;
var name;
var connections = [];
var messages = [];
var bubbles = [];
var font;

function preload()
{
	font = loadFont("/static/arial.ttf");
}

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

	socket.on("new_message", function(data) {
		messages.push(data);
		bubbles.push(new ChatBubble(data));
	});

	var canvas = createCanvas(500,500);
	canvas.parent("canvas_div");
}

function draw()
{
	socket.emit("get_name");
	socket.emit("get_connections");

	background(51);
	draw_message_bubbles();
}

function submit_form()
{
	let input = document.getElementById("inputsubmit");
	if (input.value != "")
	{
		socket.emit("send_message", {
			"message":input.value
		});
		input.value = "";
	}

}

function submit_form_enter(event)
{
	const ENTER = 13

	if (event.keyCode == ENTER)
	{
		submit_form();
	}
}

function draw_message_bubbles()
{
	for(let i = 0; i < bubbles.length; i++)
	{
		draw_bubble(bubbles[i], /*height-bubbles[i].height-15*/ 100)
	}
}

function draw_bubble(bubble, rel)
{
	bubble.draw(rel)
}