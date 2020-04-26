let socket;
let name;
let connections = [];
let messages = [];
let bubbles = [];
let font;
let pause_scroll = false;

function setup()
{
	let url = getURL();
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
		let chat_area = document.getElementById("canvas_div");
		let chat_bubble = document.createElement("div");
		let bubble_message = document.createElement("p");
		let message = document.createTextNode(data.message);
		let bubble_sender = document.createElement("p");
		let name = document.createTextNode(data.name);

		chat_bubble.setAttribute("class", "chat_bubble");
		bubble_message.setAttribute("class", "bubble_message");
		bubble_sender.setAttribute("class", "bubble_sender");

		if (data.id == socket.id)
		{
			chat_bubble.style.background = "rgb(0, 82, 42)"
		}

		bubble_message.appendChild(message);
		bubble_sender.appendChild(name);
		chat_bubble.appendChild(bubble_message);
		chat_bubble.appendChild(bubble_sender);
		chat_area.insertBefore(chat_bubble, chat_area.childNodes[0]);

	});

	noCanvas();
}

function draw()
{
	socket.emit("get_name");
	socket.emit("get_connections");
}
/*
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
}*/

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

	let chat_area = document.getElementById("canvas_div");
	if (!pause_scroll)
	{
		chat_area.scrollTop = 0;
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

/*function draw_message_bubbles()
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
}*/


// function run()
// {
// 	setup();
// 	while(true) draw();
// }

// run();
