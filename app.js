var express = require('express');
var path = require('path');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var fs = require('fs'); // 파일 시스템 모듈 불러오기
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

// 사용자 인증  모듈 불러오기
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var mysql = require('mysql'); // mysql dababase 모듈
var dbOption = {
	host: 'localhost',
	user: 'nodeuser',
	password: 'node@pass',
	database: 'otut2'
};
var conn = mysql.createConnection(dbOption);

conn.connect();
var app = express();
app.locals.pretty = true; // html 소스 표시를 계층구조로 표시하도록 합니다.
app.set('view engine', 'pug'); // 뷰 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 뷰(Views) 경로를 지정
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/user', express.static(path.join(__dirname, 'uploads'))); 
app.use(bodyParser.json()); // application/json 파싱하기 위해 설정
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded 파싱 설정
app.use(session({ // 세션 설정 정보
  secret: 'TheQuickBrownFoxJumpsOverLazyDog',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(dbOption) // 세션을 DB에 저장.
}));
app.use(passport.initialize());
app.use(passport.session());  //세션 미들웨어 뒤에 사용함.

// 로그인 확인을 위한 전역변수 처리
app.use(function(req, res, next) {
	if(req.user && req.user.displayName)
		res.locals.whoami = req.user.displayName;
	next();
});

// 라우팅 설정 -----------------------------------------\
app.get('/upload', function(req, res) {
	res.render('upload');	
});

app.post('/upload', upload.single('userfile'), function(req, res) {
	console.log(req.file);
	res.send('Uploaded');
});

/*========================================================*
 * 사용자 계정 관련 : 로그인, 회원가입
 *========================================================*/
var users = [ // 임시 데이타
	{
		authId: 'local:egoing',
		username: 'egoing',
		password: 'mTi+/qIi9s5ZFRPDxJLY8yAhlLnWTgYZNXfXlQ32e1u/hZePhlq41NkRfffEV+T92TGTlfxEitFZ98QhzofzFHLneWMWiEekxHD1qMrTH1CWY01NbngaAfgfveJPRivhLxLD1iJajwGmYAXhr69VrN2CWkVD+aS1wKbZd94bcaE=',
 		salt:'O0iC9xqMBUVl3BdO50+JWkpvVcA5g2VNaYTR5Hc45g+/iXy4PzcCI7GJN5h5r3aLxIhgMN8HSh0DhyqwAp8lLw==',
		displayName: 'Egoing'
	}
];

// 로그인 폼 화면
app.get('/auth/login', function(req, res, next) {
	if(!(req.user && req.user.displayName)) {
		res.render('login');
	} else {
		res.redirect('/topic');
	}
});

passport.serializeUser(function(user, done) {
	console.log('serializeUser', user);
	done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
	console.log('deserializeUser', id);
	for(var i = 0; i < users.length; i++) {
		var user = users[i];
		if(user.authId === id) {
			done(null, user);
		}
	}
	done('There is no user');
});

passport.use(new LocalStrategy(
	function(username, password, done) {
		var uname = username;
		var pwd = password;
		for(var i = 0; i < users.length; i++) {
			var user = users[i];
			if(uname === user.username) {
				return hasher({password: pwd, salt: user.salt}, 
					function(err, pass, salt, hash) {
						if(hash == user.password) {
							console.log('LocalStrategy', user);
							done(null, user);
						} else {
							done(null, false);
						}
					}
				);
			}
		}
		done(null, false);
	}
));

passport.use(new FacebookStrategy({
		clientID: '1970705606496360',
		clientSecret: '4dbaca3224b79ca6e6be07d82a48621b',
		callbackURL: '/auth/facebook/callback',
		profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
	},
	function(accessToken, refreshToken, profile, done) {
		console.log(profile);
		var authId = 'facebook:' + profile.id;
		for(var i=0; i < users.length; i++) {
			var user = users[i];
			if(user.authId === authId) {
				return done(null, user);
			}
		}
		var newuser = {
			'authId': authId,
			'displayName': profile.displayName,
			'email': profile.emails[0].value
		};
		users.push(newuser);
		done(null, newuser);
	}
));

// 로그인 처리
app.post('/auth/login', 
	passport.authenticate(
		'local',
		{
			successRedirect: '/topic',
			failureRedirect: '/auth/login',
			failureFlash: false
		}
	)
);

app.get('/auth/facebook',
	passport.authenticate(
		'facebook',
		{ scope: 'email'}
	)
);

app.get('/auth/facebook/callback', 
	passport.authenticate( 
		'facebook', 
		{ 
			successRedirect: '/topic',
			failureRedirect: '/auth/login' 
		}
	)
);

// 로그아웃 처리
app.get('/auth/logout', function(req, res) {
	req.logout();
	req.session.save(function(){
		res.redirect('/topic');	
	});
});

// 회원 가입 폼 화면
app.get('/auth/register', function(req, res, next) {
	if(!req.session.displayName) {
		res.render('register');
	} else {
		res.send(`
			<h2>${req.session.displayName}님은 이미 로그인 상태입니다.</h2>
			<p><a href="/topic">Home</a>&nbsp;&nbsp;
				<a href="/auth/logout">로그아웃</a></p>
		`);
	}
});

// 회원 가입 처리
app.post('/auth/register', function(req, res, next) {
	// var salt = randString.generate(12);
	hasher({password: req.body.password}, function(err, pass, salt, hash){
		if(err) return next(err);
		var user = {
			authId: 'local:' + req.body.username,
			username: req.body.username,
			password: hash,
			salt: salt,
			displayName: req.body.displayName
		};
		users.push(user);
		req.login(user, function(err) {
			if (err) { return next(err); }
			req.session.save(function(){
				res.redirect('/topic');
			});
		});
	});
	// res.json(users);
});

/*========================================================*
 * TOPIC
 *========================================================*/
// 글 쓰기 
app.get('/topic/add', function(req, res, next) {
	var sql = 'SELECT id, title FROM topics';
	conn.query(sql, function(err, topics, fields) {
		if(err) return next(err);
		
		res.render('add', {topics: topics});	
	});
});

// 글 수정 하기
app.get('/topic/:id/edit', function(req, res, next) {
	//console.log(req.path);
	var sql = 'SELECT id, title FROM topics';
	conn.query(sql, function(err, topics, fields) {
		if(err) return next(err);
		
		var id = req.params.id;
		if(id) {
			var sql = 'SELECT * FROM topics WHERE id=?';
			conn.query(sql, [id], function(err, rows, fields) {
				if(err) {
					return next(err);
				} else {
					res.render('edit', { topics: topics, topic: rows[0]});	
				}
			});
		}else {
			console.log('There is no ID');
			return next(err);
		}
	});
});

// 업데이트
app.post('/topic/:id/edit', function(req, res, next) {
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var id = req.params.id;
	var sql = 'UPDATE topics SET title=?, description=?, author=? WHERE id=?';
	
	conn.query(sql, [title, description, author, id], function(err, result, fields) {
		if(err) return next(err);

		if(result.affectedRows) {
		 	res.redirect('/topic/' + id);
		} else {
		 	res.redirect('/topic/'+ id + '/edit');
		}
	});
});

// 글 삭제
app.get('/topic/:id/delete', function(req, res, next) {
	var sql = 'SELECT id, title FROM topics';
	var id = req.params.id;
	
	conn.query(sql, function(err, topics, fields) {
		var sql = 'SELECT id, title FROM topics WHERE id=?';
		conn.query(sql, [id], function(err, topic) {
			if(err) {
				return next(err);
			} else {
				console.log(topic);
				if( topic.length === 0) {
					console.log('There is no record.');
					return next(err);
				} else {
					res.render('delete', {topics: topics, topic: topic[0] });	
				}
			}
		});
	});
});

app.post('/topic/:id/delete', function(req, res, next){
	var id = req.params.id;
	var sql = 'DELETE FROM topics WHERE id=?';
	conn.query(sql, [id], function(err, result) {
		if(err) return next(err);
		
		res.redirect('/topic');
	});
});

// 글 저장
app.post('/topic', function(req, res, next) {
	
	var title = req.body.title;
	var description = req.body.description;
	var author = req.body.author;
	var sql = 'INSERT INTO topics (title, description, author) VALUES (?, ?, ?)';
	conn.query(sql, [title, description, author], function(err, topic, fields) {
		if(err) return next(err);
		
		console.log(topic);
		if(topic.insertId) {
			res.redirect('/topic/' + topic.insertId);
		} else {
			res.redirect('/topic/add');
		}
	});
});

// 목록, 내용 보기
app.get(['/topic', '/topic/:id'], function(req, res, next) {
	var sql = 'SELECT id, title FROM topics';
	var id = req.params.id;
	conn.query(sql, function(err, topics, fields) {
		//res.json(rows);
		//console.log( 'ID: ', req.params.id);
		
		if(id) { // id 값이 있는 경우 /topic/:id
			var sql = 'SELECT * FROM topics WHERE id=?';
			conn.query(sql, [id], function(err, rows, fields) {
				if(err) {
					return next(err);
				} else {
					res.render('view', { topics: topics, topic: rows[0]});	
				}
			});
		} else {
			res.render('view', { topics: topics });	
		}
	});
});

// 404 캐치 하고 에러핸들러로 포워딩
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});
// 에러 핸들러
app.use(function(err, req, res, next) {
	err.status = err.status || 500; // status 지정 되지 않았으면 무조건 500으로 설정
	if(req.app.get('env') === 'development') {  // 개발 환경일 경우
		res.locals.message = err.message;	
		res.locals.error = err;
		console.error(err);
	} else {
		res.locals.message = err.status === 404 ? 'Page Not Found' : 'Internal Server Error';
		res.locals.error = {};
	}
	// 에러 페이지 렌더링
	res.status(err.status);
	res.render('error');
});

app.set('port', process.env.PORT || 3000); // 포트 번호 설정
var server = app.listen(app.get('port'), function(){
	console.log('익스프레스 웹서버 시작 -> Port: ' + server.address().port);
});