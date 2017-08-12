var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs'); // 파일 시스템 모듈 불러오기

var app = express();
app.locals.pretty = true; // html 소스 표시를 계층구조로 표시하도록 합니다.
app.set('view engine', 'pug'); // 뷰 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 뷰(Views) 경로를 지정

app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.json()); // application/json 파싱하기 위해 설정
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded 파싱 설정

// 라우팅 설정
app.get('/topic/new', function(req, res) {
	fs.readdir('data', function(err, files) {
		if(err) {
			console.error(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('new', {topics: files});
	});
});

app.get(['/topic', '/topic/:id'], function(req, res) {
	
	fs.readdir('data', function(err, files) {
		if(err) {
			console.error(err);
			res.status(500).send('Internal Server Error');
		}
		var id = req.params.id;
		if(id) { // id 값이 있을때 /topic/:id GET
			fs.readFile('data/'+id, 'utf8', function(err, data) {
				if(err) {
					console.error(err);
					res.status(500).send('Internal Server Error');
				}
				res.render('view', { topics : files, title: id, description: data });
			});
		} else { // id 값이 없을때 /topic GET
			res.render('view', { 
				topics : files, 
				title: 'Welcome', 
				description: 'Hello, JavaScript for server.'
			});
		}
	});
});

app.post('/topic', function(req, res) {
	// res.json(req.body);	
	var title = req.body.title;
	var description = req.body.description;
	fs.writeFile('data/' + title, description, function(err){
		if(err) {
			console.error(err);
			res.status(500).send('Internal Server Error');
		}
		//res.send('Success!');
		res.redirect('/topic/'+title);
	});
});

app.set('port', process.env.PORT || 3000); // 포트 번호 설정
var server = app.listen(app.get('port'), function(){
	console.log('익스프레스 웹서버 시작 -> Port: ' + server.address().port);
});