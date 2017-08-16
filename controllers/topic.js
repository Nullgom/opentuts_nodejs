var models = require('../models/index');
var Topic = require('../models/topic');

// 토픽 생성하기
exports.create = function(req, res) {
	// req.body 로 넘어온 값으로 새로운 Topics 모델의 인스턴스 생서한다.
	models.Topic.create(req.body).then(function(topic) {
		//res.json(topic);
		res.redirect('/topic');
	});
};

// 토픽 목록 가져오기
exports.list = function(req, res) {
	// 모든 토픽 리스트를 생성날짜로 정렬하여 가져오기
	models.Topic.findAll({
		attributes: ['id', 'title']
		//order: 'createdAt DESC'
	}).then(function(topics) {
		//res.json(topics);
		if(req.params.id) {
			byid(req.params.id, function(topic){
				res.render('topics/view.html', {
					title: '토픽 목록 보기',
					topics: topics,
					topic: topic
				});
			});
		} else {
			// 결과를 렌더링 함.
			res.render('pages/view.html', { 
				title: '토픽 목록 보기',
				topics: topics
			});
		}
	});
};

// ID로 토픽 가져오기
function byId(id, done) {
	models.Topic.find({ 
		where: { id: id	}
	}).then(function(topic) {
		done(topic);
	});
}

// ID로 토픽 갱신하기
exports.update = function(req, res) {
	models.Topic.find({
		where: {
			id: req.params.id
		}
	}).then(function(topic) {
		if(topic) { // 검색한 토픽이 있으면
			topic.updateAttributes({
				title: req.body.title,
				description: req.body.description,
				author: req.body.user_id
			}).then(function(topic){
				res.send(topic);
			});
		}
	});
};

// 토픽 삭제하기
exports.delete = function(req, res) {
	models.Topic.destroy({
		where: {
			id: req.params.id
		}
	}).then(function(topic) {
		res.json(topic);
	});
};