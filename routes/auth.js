var express = require('express');
var avatar = require('gravatar');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

module.exports = function(passport) {
	var route = express.Router();
	
	// GET /auth/login: 로그인 폼 화면
	route.get('/login', function(req, res, next) {
		if(!req.isAuthenticated()) {
			res.render('auth/login.html', {message: req.flash('loginMessage') });
		} else {
			res.redirect('/');
		}
	});
	
	// GET /auth/register: 회원 가입 폼 화면
	route.get('/register', function(req, res, next) {
		if(!req.isAuthenticated()) { 
			res.render('auth/signup.html', {message: req.flash('signupMessage') });
		} else {
			res.redirect('/');
		}
	});
	
	// GET /auth/profile: 회원 정보 화면
	route.get('/profile', isLoggedIn, function(req, res, next) {
		res.render('auth/profile.html', { 
			user: req.user,
			avatar: avatar.url(req.user.email, {s:'100', r:'x', d:'retro'}, true)
		});
	});
	
	
	// POST auth/logout : 로그인 인증 처리
	route.post('/login', passport.authenticate(
		'local-login',
		{
			successRedirect: '/',
			failureRedirect: '/auth/login',
			failureFlash: true
		}
	));
	
	// POST auth/register : 회원 가입 처리
	route.post('/register', passport.authenticate(
		'local-register',
		{
			successRedirect: '/auth/profile',
			failureRedirect: '/auth/register',
			failureFlash: true
		}
	));

	route.get('/facebook', passport.authenticate(
			'facebook',
			{ scope: 'email'}
		)
	);

	route.get('/facebook/callback', passport.authenticate( 
			'facebook', 
			{ 
				successRedirect: '/topics',
				failureRedirect: '/auth/login' 
			}
		)
	);
	
	route.get('/google', passport.authenticate(
			'google',
			{ scope: ['profile', 'email']}
		)
	);

	route.get('/google/callback', passport.authenticate( 
			'google', 
			{ 
				failureRedirect: '/auth/login' 
			}
		), function(req, res) {
			res.redirect('/');
		}
	);

	// 로그아웃 처리
	route.get('/logout', function(req, res) {
		req.logout();
		delete req.session.displayName;
		req.session.save(function(){
			res.redirect('/topics');	
		});
	});
	
	function isLoggedIn(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}
		res.redirect('/auth/login');
	}
	return route;
};