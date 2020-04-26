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
	set_form();
}

function draw()
{
	socket.emit("get_name");
	socket.emit("get_connections");
}

function set_form()
{
	const form = document.querySelector("form.form_message");

	form.addEventListener("submit", function(evert) {
		event.preventDefault();
		console.log("form");
		submit_form();
	});
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

	let chat_area = document.getElementById("canvas_div");
	if (!pause_scroll)
	{
		chat_area.scrollTop = 0;
	}
}

// function run()
// {
// 	setup();
// 	while(true) draw();
// }

// run();
