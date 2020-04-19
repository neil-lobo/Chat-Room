var express = require("express");
var app = express();
var body_parser = require("body-parser");
var multer = require("multer");
var upload = multer();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.use(upload.array());
app.set("view engine", "pug");
app.set("views", "./views")

app.listen(process.env.PORT || 3000);

app.get("/", function(req,res) {
	res.render("login");
});

app.get("/chat", function(req,res) {
	console.log(req.query);
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
