var socket;
var name;
var connections = [];
var messages = [];
var bubbles = [];
var font;
var scroll = 0;

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
	background(51);
}

function draw()
{
	socket.emit("get_name");
	socket.emit("get_connections");
	background(51);
	draw_message_bubbles();
}

function mouseWheel(event)
{
	// if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height)
	// {
	// 	if (event.delta <= 0 && bubbles[0].y < 15) //scroll up
	// 	{
	// 		scroll += event.delta;
	// 	}
	// 	else if (event.delta > 0/* && bubbles[bubbles.length-1].y + bubbles[bubbles.length-1].height < height-15*/) //scroll down
	// 	{
	// 		scroll += event.delta;
	// 	}
	// }
}

function mouseDragged(event)
{
	if (bubbles.length > 0)
	{
		// console.log(event);
		if (event.movementY >= 0) //scroll up
		{
			if (bubbles[0].y < 15)
			{
				scroll -= event.movementY;
			}
		}
		else if (event.movementY < 0) //scroll down
		{
			if (bubbles[bubbles.length-1].y + bubbles[bubbles.length-1].height > height-15)
			{	
				scroll -= event.movementY;
			}
		}
	}
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
	for(let i = bubbles.length-1; i >= 0; i--)
	{
		if (i == bubbles.length-1)
		{
			bubbles[i].draw(height-bubbles[i].height-15-scroll);
		}
		else
		{
			bubbles[i].draw(bubbles[i+1].y-bubbles[i].height-5);
		}
	}

	if(bubbles.length > 0)
	{
		if(bubbles[bubbles.length-1].y + bubbles[bubbles.length-1].height < height-15)
		{
			scroll = 0;
		}
	}
}


// function run()
// {
// 	setup();
// 	while(true) draw();
// }

// if (require.main === module)
// {
// 	run();
// }
