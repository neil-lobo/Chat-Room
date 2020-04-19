var express = require("express");
var app = express();
var body_parser = require("body-parser");
var multer = require("multer");
var upload = multer();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.use(upload.array());
app.use("/static", express.static("public"));
app.set("view engine", "pug");
app.set("views", "./views");

var server = app.listen(process.env.PORT || 3000);
var socket = require("socket.io");
var io = socket(server)

var connections = []

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
})

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
