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
	connections.push({"id":socket.id});
	console.log("[NEW SOCKET] id: " + socket.id);

	socket.on("update_name", function(data) {
		connections[connections.indexOf(data.id)].name = data.name;
	});
});
