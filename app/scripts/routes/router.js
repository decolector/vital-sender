/*global define*/

define([
    'jquery',
    'backbone',
    ''
], function ($, Backbone) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {
        	"": "home"
        },
        home: function(){
        	require(['views/index'], function(HomeView){
        		var home = new HomeView({ el:"#main" });  
        	});
        }
    });

    return AppRouter;
});
