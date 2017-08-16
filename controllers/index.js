var models = require('../models/index');
var Topic = require('../models/topic');

// index controller
exports.show = function(req, res) {
	// console.log("index.show() 호출");
	models.Topic.findAll({
		attributes: ['id', 'title'],
		//order: 'createdAt DESC'
	}).then(function(topics) {
		//res.json(topics);
		// 결과를 렌더링 함.
		res.render('pages/index.html', { 
			title: 'Server Side Javascript',
			topics: topics
		});
	});
};