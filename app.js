var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();
app.locals.pretty = true; // html 소스 표시를 계층구조로 표시하도록 합니다.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); // application/json 파싱하기 위해 설정
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded 파싱 설정

app.get('/form', function(req, res){
	
	res.render('form');
});

app.post('/form_receiver', function(req, res) {
	// res.json(req.body);
	var title = req.body.title;
	var description = req.body.description;
	res.send(title + ', ' + description);
});

app.get('/topic', function(req, res){
	// res.json(req.query);	
	var topics = [
		'Javascript is ...',
		'NodeJs is ...',
		'Express is ...'
	];
	var output =`
	<ul>
		<li><a href="/topic?id=0">JavaScript</a></li>
		<li><a href="/topic?id=1">Node.js</a></li>
		<li><a href="/topic?id=2">Express</a></li>
	</ul>
	<hr />
	<h1>${topics[req.query.id]}</h1>`;
	
	res.send(output);
});

app.get('/topic/:id/:mode', function(req, res) {
	res.json(req.params);
});

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