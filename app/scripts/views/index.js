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
            //"change #file_field": "list_files"

    		//"click #update": "update"
    	},
    	initialize: function(){
    		this.fs = requireNode('fs');
            this.path = requireNode('path');
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
        
            //var latidos = JSON.stringify(this.user_list);
            var latidos = "latidos=" +  JSON.stringify(this.user_list) ;
            console.log(latidos);
            var endpoint = "http://" + config.user.host + config.user.resource;
            //console.log(endpoint);
            $.ajax({
                //latidos: JSON.stringify(this.user_list),
                url: endpoint,
                type: "POST",
                //processData: false,
                data: latidos,
                crossDomain: true,
                //dataType: 'json',
                //contentType: "application/json",
                success: function(data, status, xhr ){
                    console.log("success: "  + JSON.stringify(data));
                },
                error: function(xhr, status, error){
                    console.log("error: " + error);
                }
            });

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
    		var user_list = {};
    		this.fs.readFileSync(file)
    			.toString()
    			.split('\n')
    			.forEach(function(line, index){
					//console.log(line);   
					var values = line.split(',');
					user_list[index] = {
                        content: {
    						email_madre: values[1].toString(),
    						nombre_madre: values[0].toString(),
    						email_hijo: values[2].toString(),
                            nombre_hijo: values[3].toString(), 
    						foto_url: values[4].toString(),
    						bpm_latidos: values[5].toString()
						}
                    };
                    //console.log("user string : " + JSON.stringify(user));
					//user_list.push(JSON.stringify(user));
                    //user_list.push(user);
			});
    		return user_list;
    	},

        list_files: function(file){
            //e.preventDefault(e);
            var user_list = {};
            //that.fs = this.fs;
            //config.user = Backbone.Syphon.serialize(this);
            this.fs.readdir(this.path.dirname(file), function(error, files){
                if(error){
                    throw error
                }
                //console.log(files); 
                files.forEach(function(name, index){

                    var values = name.split("-_-");
                    var last = values[values.length - 1];
                     //console.log(last);
                    var patt1 = new RegExp(/.maxpat/);
                    var patt2 = new RegExp(/.db/);
                    var patt3 = new RegExp(/.DS_Store/);
                    //console.log(values);
                    var match1 = last.match(patt1);
                    var match2 = last.match(patt2);
                    var match3 = last.match(patt3);

                    if(match1 == null && match2 == null && match3 == null){
                        console.log(values);
                        var ed = values[1].toString();
                        var edad = '0';
                        //var newfilename = "upload/" + name.replace('+', '-_-');
                        //this.fs.renameSync(name, newfilename);
                        if(ed == 'c'){
                            edad = '13';                                
                        }
                        else if(ed == 'a'){
                            edad = '13';
                        }else{
                            edad = '15';
                        }

                        user_list[index] = {
                            content: {
                                email_madre: values[3].toString(),
                                nombre_madre: "Mama Vital",
                                email_hijo: values[5].toString().slice(0, -4),
                                nombre_hijo: values[4].toString(),
                                //foto_url: "upload/" + name.replace('+', '\+'),
                                foto_url: 'upload/' + name,
                                bpm_latidos: values[2].toString(),
                                edad_hijo: edad
                                }
                            };
                        }
                        console.log(user_list[index]);
                    });
                });
                return user_list;
            },
    	update: function(e){
    		e.preventDefault();
    	    config.user = Backbone.Syphon.serialize(this);
    		this.user_list = this.list_files(config.user.file);
    		this.render();
    	}
    });
    return HomeView;
});

// edad hijo
// a = menor de 14 = 13 
// b = mayor de 14 = 15
// b = no hijos = 0
