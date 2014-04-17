/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!templates/home',
    'config/config',
    'backbone_syphon',

], function ($, _, Backbone, template, config) {
    'use strict';

    var HomeView = Backbone.View.extend({
    	events: {
    		"submit": "sendAll",
    		"change #file_field": "update"
    		//"click #update": "update"
    	},
    	initialize: function(){
    		this.http = requireNode('http');
    		this.fs = requireNode('fs');
    		this.user_list = [];
    		this.index = 0;
    		this.render();

    	},
    	render: function(){
    		this.$el.html(template({users: this.user_list, config: config, status: this.status}));
    		return this;
    	},
        sendAll: function(e){
            e.preventDefault();
            config.user = Backbone.Syphon.serialize(this);
            //console.log("form data: " + JSON.stringify(config.user));
            
            var latidos = '[' + this.user_list + ']';

            var req = this.http.request({
                    hostname: config.user.host,
                    path: config.user.resource,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'vital-sender/0.0.1',
                        'Content-length': latidos.length
                    }
                },
                function(res){
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.headers));
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        console.log('BODY: ' + chunk);
                    });
            });

            console.log(latidos);
            req.write(latidos );
            console.log(req);
            req.end();

        },
    	sendOne: function(e){
    		e.preventDefault();

    		if(this.index < this.user_list.length){

	  			config.user = Backbone.Syphon.serialize(this);
	    		//console.log("form data: " + JSON.stringify(config.user));
	    		
	    		var req = this.http.request({
						hostname: config.user.host,
						path: config.user.resource,
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
				});

				console.log(this.user_list[this.index]);
				req.write(JSON.stringify(this.user_list[this.index]));
				req.end();
				this.index++;
			}else{
				alert("Final de la lista de peticiones");
			}
    	},

    	list_users: function(file){
    		var user_list = [];
    		this.fs.readFileSync(file)
    			.toString()
    			.split('\n')
    			.forEach(function(line){
					//console.log(line);
					var values = line.split(',');
					var user = {
                        content: {
    						email_madre: values[1].toString(),
    						nombre_madre: values[0].toString(),
    						email_hijo: values[2].toString(),
    						foto_url: values[3].toString(),
    						bpm_latidos: values[4].toString()
						}
                    };
                    //console.log("user string : " + JSON.stringify(user));
					user_list.push(JSON.stringify(user));
			});
    		return user_list;
    	},

    	update: function(e){
    		e.preventDefault();
    	    config.user = Backbone.Syphon.serialize(this);
    		this.user_list = this.list_users(config.user.file);
    		this.render();
    	}
    });
    return HomeView;
});
