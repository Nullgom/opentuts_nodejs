var mysql = require('mysql');
var conn = mysql.createConnection({
	host: 'localhost',
	user: 'nodeuser',
	password: 'node@pass',
	database: 'otut2'
});

conn.connect();

// var sql = 'SELECT * FROM topics';
// conn.query(sql, function(err, rows, fields) {
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		for(var i=0; i< rows.length; i++) {
// 		//for(i in rows){
// 			console.log(rows[i].author);
// 		}
// 	}
// });

// var sql = 'INSERT INTO topics (title, description, author) VALUES(?, ?,?)';
// var params = ['Supervisor', 'Watcher', 'graphittie'];
// conn.query(sql, params, function(err, rows, fields){
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(rows.insertId);
// 	}	
// });

// var sql = 'UPDATE topics SET title=?, author=? WHERE id=?';
// var params = ['NPM', 'leezche', 1];
// conn.query(sql, params, function(err, rows, fields){
// 	if(err) {
// 		console.log(err);
// 	} else {
// 		console.log(rows);
// 	}	
// });

var sql = 'DELETE FROM topics WHERE id=?';
var params = [1];
conn.query(sql, params, function(err, rows, fields){
	if(err) {
		console.log(err);
	} else {
		console.log(rows);
	}	
});

conn.end();