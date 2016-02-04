var  http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();

console.log('');
app.get('/',function(req,res){
	
	fs.readFile('views/index.html',function(error,data){
		
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);
	});
});

app.get('/main/:id/:num?',function(req,res,next){	
	var id = req.params.id;
	var num = req.params.num;
	var nextStr = "";
	console.log(id);
	console.log("num="+num);
	
	if(id == "main"){
		nextStr = "views/index.html";
	}else if(id == "write"){
		nextStr = "views/write.html";
	}else if(id == "detail"){
		nextStr = "views/read.html";
	}else{
		nextStr = "views/index.html";
	}
	
		fs.readFile(nextStr,function(error,data){
		res.writeHead(200,{'Content-Type':'text/html'});
		res.end(data);

	});
});




app.listen(8008,function(){
	console.log('Server Start');
});