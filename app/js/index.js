/**
 * Created by jweber on 01.10.13.
 */
$(document).ready(function(){
	console.log("application started");
	var http = require("https");
	var fs = require('fs');

	fs.readFileSync('app/data/input.txt').toString().split('\n').forEach(function(line){
		console.log(line);
	});
	var req = http.request({
			hostname: 'api.mongohq.com',
			path: '/databases/vital/collections/mothers/documents?_apikey=6pnomhzb6yre2nifkc4u',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}

		},
		function(res){
			console.log('STATUS: ' + res.statusCode);
  			console.log('HEADERS: ' + JSON.stringify(res.headers));
  			res.setEncoding('utf8');
  			res.on('data', function (chunk) {
    			console.log('BODY: ' + chunk);
  			});
		  	/*res.on('end', function(responseString) {
		    	var resultObject = JSON.parse(responseString);
		  	});*/
		});

	$("#send").click(function(e){
		e.preventDefault();
		console.log("hello world");
		var data = '{"document":{"foo": "bar"}}';
		req.write(data);
		req.end();
	});
});