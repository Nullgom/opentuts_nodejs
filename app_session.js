var express = require('express');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'TheQuickBrownFoxJumpsOverLazyDog',
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore({
	host: 'localhost',
	port: 3306,  
	user: 'nodeuser',
	password: 'node@pass',
	database: 'otut2'
  })
}));

// 세션을 이용한 카운터
app.get('/count', function (req, res) {
	if(req.session.count) {
		req.session.count ++;	
	} else {
		req.session.count = 1;	
	}
	
	res.send('Count : ' + req.session.count);
});

// 세션을 이용한 로그인

app.get('/welcome', function(req, res) {
	if(req.session.displayName) {
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
			<a href="/auth/logout">Logout</a>
		`);		
	} else {
		res.send(`
			<h1>Welcome !!</h1>
			<a href="/auth/login">Login</a>
		`);
	}
});

app.get('/auth/logout', function(req, res) {
	delete req.session.displayName;
	req.session.save(function(){
		res.redirect('/welcome');	
	});
});

app.post('/auth/login', function(req, res) {
	var user = {
		username: 'egoing',
		password: '112233',
		displayName: 'Egoing'
	};
	var uname = req.body.username,
		pwd = req.body.password;
	
	if(uname === user.username && pwd === user.password) {
		req.session.displayName = user.displayName;
		req.session.save(function() {
			res.redirect('/welcome');	
		});
	} else {
		res.send('Who are you? <a href="/auth/login">Login</a>');
	}
});

app.get('/auth/login', function(req, res) {
	var output = `
	<h1>LOGIN</h1>
	<form action="/auth/login" method="POST">
		<p><input type="text" name="username" placeholder="사용자이름 입력" /></p>
		<p><input type="password" name="password" placeholder="비밀번호 입력" /></p>
		<p><input type="submit" value="로그인"/></p>
	</form>
	`;
	if(!req.session.displayName) {
		res.send(output);	
	} else {
		res.redirect('/welcome');
	}
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});