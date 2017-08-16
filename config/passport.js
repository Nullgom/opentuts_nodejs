var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStartegy = require('passport-google-oauth20').Strategy;
var config = require('./config');
var models = require('../models/index');
var User = require('../models/user');

// 사용자 인증  모듈 불러오기
module.exports = function(passport) {
	
	passport.serializeUser(function(user, done) {
		done(null, user.authId);
	});

	passport.deserializeUser(function(id, done) {
		models.User.find({
			where: {authId: id}
		}).then(function(user) {
			done(null, user);
		}).catch(function(err){
			done(err);
		});
	});

	passport.use('local-login', new LocalStrategy({
			usernameField: 'username',
        	passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, done) {
			models.User.find({
				where: { authId: 'local:' + username }
			}).then(function(user){
				if(!user) {
					return done(null, false, req.flash('loginMessage', '사용자가 없습니다.'));
				}
				return hasher({
						password: password, salt: user.salt
					}, function(err, pass, salt, hash) {
						if(hash === user.password) {
							//req.session.displayName = user.displayName;
							return done(null, user);
						} else {
							return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
						}
					});
			}).catch(function(err){
				return done(err);
			});
		}
	));
	
	passport.use('local-register', new LocalStrategy({
			usernameField: 'username',
        	passwordField: 'password',
			passReqToCallback: true
		},
		function(req, username, password, done) {
			process.nextTick(function() {
				if(!req.user) {
					models.User.find({
						where: { authId: 'local:' + username }
					}).then(function(user) {
						if(user) {
							return done(null, false, req.flash('signupMessage', '이미 사용하고 있는 사용자 이름입니다.'));
						} else {
							return hasher({password: password},
								function(err, pass, salt, hash){
									models.User.create({
										authId: 'local:' + req.body.username,
										username: req.body.username,
										salt: salt,
										password: hash,
										email: req.body.email,
										displayName: req.body.displayName
									}).then(function(newUser) {
										// req.session.displayName = newuser.displayName;
										return done(null, newUser);
									}).catch(function(err){
										return done(err);
									});
								}
							);
						}
					}).catch(function(err) { return done(err); });
				} else {
					// req.session.displayName = req.user.displayName;
					return done(null, req.user);
				}
			});
		}
	));

	passport.use(new FacebookStrategy( config.facebook,
		function(accessToken, refreshToken, profile, done) {
			// console.log(profile);
			process.nextTick(function() {
				models.User.find({
					where: { authId: 'facebook:' + profile.id }
				}).then(function(user){
					console.log('페이스북 전략');
					console.log(user);
					if(user) {
						return done(null, user);
					} else {
						return 	models.User.create({
							'authId': 'facebook:' + profile.id,
							'displayName': profile.displayName,
							'email': profile.emails[0].value	
						}).then(function(newUser){
							console.log('페이스북 인증 ------');
							console.log(newUser);
							return done(null, newUser); 
						}).catch(function(err){ return done(err); });
					}
				}).catch(function(err){ return done(err); });
			});
			
		}
	));
	
	passport.use(new GoogleStartegy( config.google,
		function(accessToken, refreshToken, profile, done) {
			console.log('구글 인증 --------');
			// console.log(profile);
			process.nextTick(function() {
				models.User.find({
					where: {authId: 'google:' + profile.id }
				}).then(function(user){
					if(user) return done(null, user);
					return models.User.create({
						'authId': 'facebook:' + profile.id,
						'displayName': profile.displayName,
						'email': profile.emails[0].value	
					}).then(function(newUser){
						//console.log('구글 인증 --------');
						//console.log(newUser);
						return done(null, newUser); 
					}).catch(function(err) {return done(err); });
				}).catch(function(err) {return done(err); });
			});
		}
	));	
	return passport;
};