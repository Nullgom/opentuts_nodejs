var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer'); // 파일 업로드 모듈 불러오기
var _storage = multer.diskStorage({
	destination: function (req, file, cb) {	
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ storage: _storage });
var fs = require('fs'); // 파일 시스템 모듈 불러오기
var mysql = require('mysql'); // mysql dababase 모듈
var conn = mysql.createConnection({
	host: 'localhost',
	user: 'nodeuser',
	password: 'node@pass',
	database: 'otut2'
});

conn.connect();
var app = express();
app.locals.pretty = true; // html 소스 표시를 계층구조로 표시하도록 합니다.
app.set('view engine', 'pug'); // 뷰 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 뷰(Views) 경로를 지정
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/user', express.static(path.join(__dirname, 'uploads'))); 
app.use(bodyParser.json()); // application/json 파싱하기 위해 설정
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded 파싱 설정

// 라우팅 설정 -----------------------------------------\
app.get('/upload', function(req, res) {
	res.render('upload');	
});

app.post('/upload', upload.single('userfile'), function(req, res) {
	
	console.log(req.file);
	res.send('Uploaded');
});

// 글 쓰기 
app.get('/topic/add', function(req, res) {
	var sql = 'SELECT id, title FROM topics';
	conn.query(sql, function(err, topics, fields) {
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
		} else {
			res.render('add', {topics: topics});	
		}
	});
});

// 글 수정 하기
app.get('/topic/:id/edit', function(req, res) {
	var sql = 'SELECT id, title FROM topics';
	conn.query(sql, function(err, topics, fields) {
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
			return;
		}
		var id = req.params.id;
		if(id) {
			var sql = 'SELECT * FROM topics WHERE id=?';
			conn.query(sql, [id], function(err, rows, fields) {
				if(err) {
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('edit', { topics: topics, topic: rows[0]});	
				}
			});
		}else {
			console.log('There is no ID');
			res.status(500).send('Internal Server Error');
		}
	});
});

// 업데이트
app.post('/topic/:id/edit', function(req, res) {
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var id = req.params.id;
	var sql = 'UPDATE topics SET title=?, description=?, author=? WHERE id=?';
	
	conn.query(sql, [title, description, author, id], function(err, result, fields) {
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
			return;
		}
		if(result.affectedRows) {
		 	res.redirect('/topic/' + id);
		} else {
		 	res.redirect('/topic/'+ id + '/edit');
		}
	});
});

// 글 삭제
app.get('/topic/:id/delete', function(req, res) {
	var sql = 'SELECT id, title FROM topics';
	var id = req.params.id;
	
	conn.query(sql, function(err, topics, fields) {
		var sql = 'SELECT id, title FROM topics WHERE id=?';
		conn.query(sql, [id], function(err, topic) {
			if(err) {
				console.log(err);
				res.status(500).send('Internal Server Error');
			} else {
				console.log(topic);
				if( topic.length === 0) {
					console.log('There is no record.');
					res.status(500).send('Internal Server Error');
				} else {
					res.render('delete', {topics: topics, topic: topic[0] });	
				}
			}
		});
	});
});

app.post('/topic/:id/delete', function(req, res){
	var id = req.params.id;
	var sql = 'DELETE FROM topics WHERE id=?';
	conn.query(sql, [id], function(err, result) {
		res.redirect('/topic');
	});
});

// 글 저장
app.post('/topic', function(req, res) {
	
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var sql = 'INSERT INTO topics (title, description, author) VALUES (?, ?, ?)';
	conn.query(sql, [title, description, author], function(err, topic, fields) {
		if(err) {
			console.log(err);
			res.status(500).send('Internal Server Error');
			return;
		}
		console.log(topic);
		if(topic.insertId) {
			res.redirect('/topic/' + topic.insertId);
		} else {
			res.redirect('/topic/add');
		}
	});
});

// 목록, 내용 보기
app.get(['/topic', '/topic/:id'], function(req, res) {
	var sql = 'SELECT id, title FROM topics';
	
	conn.query(sql, function(err, topics, fields) {
		//res.json(rows);
		var id = req.params.id;
		if(id) { // id 값이 있는 경우 /topic/:id
			var sql = 'SELECT * FROM topics WHERE id=?';
			conn.query(sql, [id], function(err, rows, fields) {
				if(err) {
					console.log(err);
					res.status(500).send('Internal Server Error');
				} else {
					res.render('view', { topics: topics, topic: rows[0]});	
				}
			});
		} else {
			res.render('view', { topics: topics });	
		}
	});
});


app.set('port', process.env.PORT || 3000); // 포트 번호 설정
var server = app.listen(app.get('port'), function(){
	console.log('익스프레스 웹서버 시작 -> Port: ' + server.address().port);
});