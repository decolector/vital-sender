define([], function(){
	var config = {
        "user": {
    		"host": "www.latidosvitales.com",
    		"resource": "/response.php"
        },
        "default":{
        	"host": "api.mongohq.com",
    		"resource": "/databases/vital/collections/mothers/documents?_apikey=6pnomhzb6yre2nifkc4u"
        }
    }
    return config;
})