var express = require('express');
var path = require('path');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var config = require('./config/config');
var conn = require('./config/db')();
var app = express();

app.locals.pretty = true; // html 소스 표시를 계층구조로 표시하도록 합니다.
app.set('view engine', 'pug'); // 뷰 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 뷰(Views) 경로를 지정
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.json()); // application/json 파싱하기 위해 설정
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded 파싱 설정
app.use(session({ // 세션 설정 정보
	secret: 'TheQuickBrownFoxJumpsOverLazyDog',
	resave: false,
	saveUninitialized: true,
	store: new MySQLStore(config.dbOption) // 세션을 DB에 저장.
}));
// 로그인 확인을 위한 전역변수 처리
app.use(function(req, res, next) {
	if(req.user && req.user.displayName)
		res.locals.whoami = req.user.displayName;
	next();
});

// 라우팅 설정 -----------------------------------------\
/*========================================================*
 * 사용자 계정 관련 : 로그인, 회원가입
 *========================================================*/
var passport = require('./config/passport')(app);
var auth = require('./routes/auth')(passport);
app.use('/auth', auth);

/*========================================================*
 * TOPIC
 *========================================================*/
var topics = require('./routes/topics')();
app.use('/topic', topics);
app.get('/', function(req, res){
	res.redirect('/topic');
});

/* ========================================================
 * 404 및  오류  처리 부분
 * ========================================================*/
// 404 캐치 하고 에러핸들러로 포워딩
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// 에러 핸들러
app.use(function(err, req, res, next) {
	err.status = err.status || 500; // status 지정 되지 않았으면 무조건 500으로 설정
	if(config.ENV === 'development') {  // 개발 환경일 경우
		res.locals.message = err.message;	
		res.locals.error = err;
		console.error(err);
	} else {
		res.locals.message = err.status === 404 ? 'Page Not Found' : 'Internal Server Error';
		res.locals.error = {status: err.status};
	}
	// 에러 페이지 렌더링
	res.status(err.status);
	res.render('error');
});

app.set('port', config.PORT || 3000); // 포트 번호 설정
var server = app.listen(app.get('port'), function(){
	console.log('익스프레스 웹서버 시작 -> Port: ' + server.address().port);
});