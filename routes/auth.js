var express = require('express');
module.exports = function(passport) {
	var route = express.Router();	
	// 로그인 폼 화면
	route.get('/login', function(req, res, next) {
		if(!(req.user && req.user.displayName)) {
			res.render('auth/login');
		} else {
			res.redirect('/topic');
		}
	});

	// 로그인 처리
	route.post('/login', passport.authenticate(
			'local',
			{
				successRedirect: '/topic',
				failureRedirect: '/auth/login',
				failureFlash: false
			}
		)
	);

	route.get('/facebook', passport.authenticate(
			'facebook',
			{ scope: 'email'}
		)
	);

	route.get('/facebook/callback', passport.authenticate( 
			'facebook', 
			{ 
				successRedirect: '/topic',
				failureRedirect: '/auth/login' 
			}
		)
	);

	// 로그아웃 처리
	route.get('/logout', function(req, res) {
		req.logout();
		req.session.save(function(){
			res.redirect('/topic');	
		});
	});

	// 회원 가입 폼 화면
	route.get('/register', function(req, res, next) {
		if(!req.session.displayName) {
			res.render('auth/register');
		} else {
			res.send(`
				<h2>${req.session.displayName}님은 이미 로그인 상태입니다.</h2>
				<p><a href="/topic">Home</a>&nbsp;&nbsp;
					<a href="/auth/logout">로그아웃</a></p>
			`);
		}
	});

	// 회원 가입 처리
	route.post('/register', function(req, res, next) {
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
			var sql = 'INSERT INTO users SET ?';
			conn.query(sql, user, function(err, results) {
				if(err) { return next(err);}
				req.login(user, function(err){
					req.session.save(function() {
						res.redirect('/topic');	
					});	
				});
			});
		});
	});
	
	return route;
};