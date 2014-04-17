/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var UserModel = Backbone.Model.extend({
        defaults: {
        },
        baseUrl: "https://mongohq.com",
        url:"/databases/vital/collections/mothers/documents?_apikey=6pnomhzb6yre2nifkc4u"
    });

    return UserModel;
});
