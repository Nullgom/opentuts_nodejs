var models = require('../models/index');
var User = require('../models/user');
var express = require('express');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

// 사용자 생성
exports.create = function(req, res) {
	// req.body 값을 사용하여 Users 모델 인스탄스 생성
	hasher({password: req.body.password}, function(err, pass, salt, hash){
		if(err) return console.error(err);
		models.User.create({
			authId: 'local:' + req.body.username,
			username: req.body.username,
			salt: salt,
			password: hash,
			email: req.body.email
		}).then(function(user){
			res.json(user);
		});
	});
};

// 사용자 목록
exports.list = function(req, res) {
	// 모든 사용자 리스트
	models.User.findAll({}).then(function(users) {
		res.json(users);
	});
};

