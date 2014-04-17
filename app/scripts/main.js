/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        handlebars: {
            exports: 'Handlebars'
        },
        backbone_syphon: {
            deps: ['backbone']
        }
    },
    paths: {
        jquery: '../libs/jquery/jquery',
        backbone: '../libs/backbone/backbone',
        underscore: '../libs/underscore/underscore',
        bootstrap: '../libs/sass-bootstrap/dist/js/bootstrap',
        handlebars: '../libs/handlebars/handlebars',
        hbs: '../libs/require-handlebars-plugin/hbs',
        backbone_syphon : '../libs/backbone.syphon/lib/amd/backbone.syphon',

        templates: 'templates',
        routers: 'routes',
        views: 'views',
        models: 'models',
        //collections: 'collections',
        config: 'config'
        //utils: 'utils'
    }
});

require([
    'backbone',
    'routers/router'
], function (Backbone, AppRouter) {
    //window.config = requireNode('./scripts/config/config.json');
    window.router = new AppRouter();
    Backbone.history.start();
});
