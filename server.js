let express = require("express");
let app = express();
let body_parser = require("body-parser");
let multer = require("multer");
let upload = multer();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.use(upload.array());
app.use("/static", express.static("public"));
app.set("view engine", "pug");
app.set("views", "./views");

let server = app.listen(process.env.PORT || 3000);
let socket = require("socket.io");
let io = socket(server)

let connections = []
let recent_messages = [] //holds last 100 messages from the time server starts

app.get("/", function(req,res) {
	res.render("login");
});

app.post("/", function(req,res) {
	res.redirect("/chat?name=" + req.body.name);
});

app.get("/chat", function(req,res) {
	try
	{
		if (req.query.name == "" || req.query.name == undefined)
		{
			throw Error
		}
		else
		{
			res.render("chat", {
				name: req.query.name
			});
		}
	}
	catch(err)
	{
		res.redirect("/");
	}
});

io.sockets.on("connection", function(socket) {
	console.log("[SOCKET CONNECTED] id: " + socket.id);
	connections.push({"id":socket.id});

	socket.on("disconnect", function() {
		console.log("[SOCKET DISCONNECTED] " + connection_toString(connections[indexOfID(socket.id)]));
		connections.splice(indexOfID(socket.id), 1);
	});

	socket.on("update_name", function(data) {
		connections[indexOfID(socket.id)].name = data.name;
	});

	socket.on("get_name", function()
	{
		io.to(socket.id).emit("set_name", {
			"name": connections[indexOfID(socket.id)].name
		})
	});

	socket.on("get_connections", function()
	{
		let _connections = [];
		for (let i = 0; i < connections.length; i++)
		{
			_connections[i] = connections[i]
		}

		io.to(socket.id).emit("set_connections", {
			"connections": _connections
		})
	});

	socket.on("send_message", function(data) {
		
		_data = {
			"message":data.message,
			"name": connections[indexOfID(socket.id)].name,
			"id": socket.id
		}
		remeber_message(_data);
		io.emit("new_message", _data);
	});
});

function indexOfID(id)
{
	for(let i = 0; i < connections.length; i++)
	{	
		let connection = connections[i];
		if (id == connection.id)
		{	
			return i;
		}
	}

	return undefined;
}

function print_connections()
{
	for (let i = 0; i < connections.length; i++)
	{
		console.log(connections[i].id + " : " + connections[i].name);
	}
}

function connection_toString(connection)
{
	return("{'id':'" + connection.id + "', 'name':'" + connection.name + "'}")
}

function remeber_message(data)
{
	if (recent_messages.length > 100)
	{
		recent_messages.splice(0,1);
	}
	recent_messages.push(data);
}
