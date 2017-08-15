module.exports = function() {
	var conn = require('../config/db')();
	var route = require('express').Router();
	
	// 토픽 작성 폼 
	route.get('/add', function(req, res, next) {
		var sql = 'SELECT id, title FROM topics';
		conn.query(sql, function(err, topics, fields) {
			if(err) { return next(err);}
			res.render('topics/add', {topics: topics});	
		});
	});
		
	// 토픽 수정 폼
	route.get('/:id/edit', function(req, res, next) {
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
						res.render('topics/edit', { topics: topics, topic: rows[0]});	
					}
				});
			}else {
				console.log('There is no ID');
				return next(err);
			}
		});
	});

	// 토픽 업데이트
	route.post('/:id/edit', function(req, res, next) {
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

	// 토픽 삭제 페이지(폼)
	route.get('/:id/delete', function(req, res, next) {
		var sql = 'SELECT id, title FROM topics';
		var id = req.params.id;

		conn.query(sql, function(err, topics, fields) {
			var sql = 'SELECT id, title FROM topics WHERE id=?';
			conn.query(sql, [id], function(err, topic) {
				if(err) {
					return next(err);
				} else {
					//console.log(topic);
					if( topic.length === 0) {
						console.log('There is no record.');
						return next(err);
					} else {
						res.render('topics/delete', {topics: topics, topic: topic[0] });	
					}
				}
			});
		});
	});
	
	// 토픽 삭제
	route.post('/:id/delete', function(req, res, next){
		var id = req.params.id;
		var sql = 'DELETE FROM topics WHERE id=?';
		conn.query(sql, [id], function(err, result) {
			if(err) return next(err);
			res.redirect('/topic');
		});
	});

	// 토픽 저장
	route.post('/', function(req, res, next) {
		var title = req.body.title;
		var description = req.body.description;
		var author = req.body.author;
		var sql = 'INSERT INTO topics (title, description, author) VALUES (?, ?, ?)';
		conn.query(sql, [title, description, author], function(err, topic, fields) {
			if(err) return next(err);
			// console.log(topic);
			if(topic.insertId) {
				res.redirect('/topic/' + topic.insertId);
			} else {
				res.redirect('/topic/add');
			}
		});
	});
	
	// 토픽 목록 보기
	route.get(['/', '/:id'], function(req, res, next) {
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
						res.render('topics/view', { topics: topics, topic: rows[0]});	
					}
				});
			} else {
				res.render('topics/view', { topics: topics });	
			}
		});
	});
	return route;
};