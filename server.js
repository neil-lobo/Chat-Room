var express = require("express");
var app = express();
var body_parser = require("body-parser");
var multer = require("multer");
var upload = multer();

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.use(upload.array());

app.listen(process.env.PORT || 3000);
