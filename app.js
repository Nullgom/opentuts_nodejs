var express = require('express');
var path = require('path');
var app = express();

app.locals.pretty = true; // html 소스 표시를 계층구조로 표시하도록 합니다.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/template', function(req, res) {
	res.render('temp', {
		'title': 'Pug(Jade)',
		'time':Date()
	});
});

app.get('/', function(req, res){
	res.send('Hello, Home Page!');
});

app.get('/dynamic', function(req, res){
	var lis = '';
	for(var i=0; i < 5; i++) {
		lis = lis + '<li>coding'+i+'</li>';
	}
	var time = Date();
	var output = `
	<!DOCTYPE html>
	<html>
	<hd><title>Express Web</title></head>
	<body>
	<h1>Welcome to Express.</h1>
	<h2>Hello, Dynamic!</h2>
	<ul>${lis}<ul>
	${time}
	</body>
	</html>`;
	res.send(output);
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