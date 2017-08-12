var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.send(`
	<!DOCTYPE html>
	<html>
	<hd><title>Express Web</title></head>
	<body>
	<h1>Welcome to Express.</h1>
	<h1>Hello World!</h1>
	</body>
	</html>`);
});
app.get('/route', function(req, res){
	res.send('Hello Router, <img src="/images/textcloud.jpg" />');	
});

app.get('/login', function(req, res){
	res.send('<h1>Login Please!</h1>');
});
app.listen(80, function(){
	console.log('Connected 80 port!!');
});