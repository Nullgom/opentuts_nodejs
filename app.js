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

var app = express();
app.locals.pretty = true; // html 소스 표시를 계층구조로 표시하도록 합니다.
app.set('view engine', 'pug'); // 뷰 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 뷰(Views) 경로를 지정

app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/user', express.static(path.join(__dirname, 'uploads'))); 
app.use(bodyParser.json()); // application/json 파싱하기 위해 설정
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded 파싱 설정

// 라우팅 설정
app.get('/upload', function(req, res) {
	res.render('upload');	
});

app.post('/upload', upload.single('userfile'), function(req, res) {
	
	console.log(req.file);
	res.send('Uploaded');
});

app.set('port', process.env.PORT || 3000); // 포트 번호 설정
var server = app.listen(app.get('port'), function(){
	console.log('익스프레스 웹서버 시작 -> Port: ' + server.address().port);
});