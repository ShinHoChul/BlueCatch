var  http = require('http');
var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var io = require('socket.io');

var connection = mysql.createConnection({
    host    :'localhost',
    port : 3306,
    user : 'root',
    password : 'okok',
    database:'testdb'
});

connection.connect(function(err) {
    if (err) {
        console.error('mysql connection error');
        console.error(err);
        console.log('2');
    }
});
 

var app = express();

var httpServer =http.createServer(app).listen(8008, function(req,res){
  console.log('Socket IO server has been started');
});

// upgrade http server to socket.io se rver
var io = require('socket.io').listen(httpServer);

// all environments
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//데이타 불러오는 부분
app.get('/',function(req,res){	
	
	fs.readFile('views/index.html',function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);	
	});
});

/*
	socket.IO 영역
*/

io.sockets.on('connection', function (socket) {
		  socket.on('example message 2', function (data) {
		  	console.log("socket data = "+data.hello);
		  		if(data.hello == "main"){
				  		connection.query('select * from board',function(err,rows){
						 	socket.emit('example message 1', { hello: rows });
						});
		  		}else if(data.hello == "modify"){
			  			connection.query('select * from board where num='+num,function(err,rows){
							 socket.emit('example message 1', { hello: rows });
						});
		  		}else if(data.hello == "detail"){
			  			connection.query('select * from board where num='+num,function(err,rows){
							 socket.emit('example message 1', { hello: rows });
						});
		  		}
		  });

		   
		    socket.on('contentChange', function (data) {

		       connection.query('UPDATE `board` SET `content`="'+data.content+'" WHERE num ='+data.num,function(err,rows){
			//selectBoard(rows);
			});
			
	  });
	  	  socket.on('titleChange', function (data) {

		    connection.query('UPDATE `board` SET `title`="'+data.title+'" WHERE num ='+data.num,function(err,rows){
			//selectBoard(rows);
			});
	  });
 
	});


/*******************************/
var id,num,nextStr; 
//페이지이동~ 
app.get('/main/:id/:num?',function(req,res,next){	
	 id = req.params.id;
	console.log(id);

	 num = req.params.num;
	 nextStr = "";
	
	
	if(id == "main"){
		nextStr = "views/index.html";
	}else if(id == "write"){
		nextStr = "views/write.html";
	}
	else if(id == "modify"){
		nextStr = "views/modify.html";
	}
	else if(id == "detail"){
		nextStr = "views/read.html";
	}else if(id == "delete"){
		
		connection.query('DELETE FROM `board`  where num='+num,function(err,rows){});
		
		nextStr = "views/index.html";	
	}else{
		connection.query('select * from board',function(err,rows){
		selectBoard(rows);
		});
		nextStr = "views/index.html";
	}
	
		fs.readFile(nextStr,function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);

	});
});
var user;
//Write 에서 Post값 받는 부분
app.post('/users',function(req,res){
	console.log('HI POST');
	console.log("title = "+req.param('usertitle'));
	console.log("content ="+req.param('usercontent'));
	
	   user = {'title':req.param('usertitle'),
                'content':req.param('usercontent')};
                
			connection.query('insert into board set ?',user,function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        });
        
        connection.query('select * from board',function(err,rows){
		selectBoard(rows);
		});
        
     fs.readFile("views/index.html",function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
    });

});
 