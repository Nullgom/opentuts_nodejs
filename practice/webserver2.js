const http = require('http');
const hostname = '127.0.0.1'; // 로컬에서 실행시 설정
const port = 1337;

/*
http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(port, hostname, ()=>{
	console.log(`Server running at http://${hostname}:${port}/`);
});
*/

var server = http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
});

server.listen(port, function(){
	console.log(`Server running at http://${hostname}:${port}/`);
});