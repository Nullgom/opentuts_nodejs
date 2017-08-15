module.exports = function() {
	// 데이터베이스 설정 블러오기
	var config = require('./config.js'); // 테이터베이스 설정을 모듈로 따로 분리함.
	var mysql = require('mysql'); // mysql dababase 모듈
	var conn = mysql.createConnection(config.dbOption);
	conn.connect();
	
	return conn;
};