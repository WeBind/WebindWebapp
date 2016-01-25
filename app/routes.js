var builder = require('xmlbuilder');
var http = require('http');

module.exports = function(app) {

	// error
	app.get('/error', function(req, res) {
	    res.send('Error');
	});

	// index
	app.get('/', function(req, res) {
	    res.sendfile('./views/index.html');
	});

	app.post('/api/scenario', function(req, res) {
		var root = builder.create('Scenario', {version: '1.0', encoding: 'ISO-8859-1'});

		var providers = root.ele('Providers');

		for(var i = 0 ; i < req.body.providers.length ; i++) {
			var p = providers.ele('Provider');
			p.ele('id', req.body.providers[i].id);
			p.ele('Response_length', req.body.providers[i].size);
			p.ele('Response_time', req.body.providers[i].delay);
		}

		var consumers = root.ele('Consumers');

		for(var i = 0 ; i < req.body.consumers.length ; i++) {
			var c = consumers.ele('Consumer');
			c.ele('id', req.body.consumers[i].id);
			c.ele('Starting_time', req.body.consumers[i].startingTime);
			c.ele('Size', req.body.consumers[i].size);
			c.ele('Duration', req.body.consumers[i].duration);
			c.ele('Period', req.body.consumers[i].period);
			c.ele('Provider', req.body.consumers[i].provider);
		}

		var xmlString = root.end({ pretty: true, indent: '  ', newline: '\n' });

		console.log(xmlString);

		var options = {
                        host : 'localhost', // here only the domain name  @@@@@ TO DO @@@@@
                        // (no http/https !)
                        port : 8080,
                        path : '/WebApplicationPlasson/plasson/', // the rest of the url with parameters if needed
                        headers: {
                            "Content-Type": "application/xml",
                            "Content-Length": Buffer.byteLength(xmlString)
                        },
                        method : 'POST' // do POST
                    }

        var post_req = http.request(options, function(res2) {
            console.log('STATUS: ' + res2.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res2.headers));
            res2.setEncoding('utf8');
            str = "";
            res2.on('data', function (chunk) {
                str += chunk;
        	});

        	res2.on('end', function () {
        		if (err)
                    throw err;
                console.log(str);
            });
        }).on('error', function(e) {console.log("Got error: " + e.message); res.status(400).send();});

        post_req.write(xmlString);
        post_req.end(); 

		res.status(200).send();
	});

	app.get('/api/results', function(req, res) {

		var options = {
                        host : 'localhost', // here only the domain name  @@@@@ TO DO @@@@@
                        // (no http/https !)
                        port : 8080,
                        path : '/WebApplicationPlasson/plasson/', // the rest of the url with parameters if needed
                        method : 'GET' // do POST
                    }

        var post_req = http.request(options, function(res2) {
            console.log('STATUS: ' + res2.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res2.headers));
            res2.setEncoding('utf8');
            str = "";
            res2.on('data', function (chunk) {
                str += chunk;
        	});

        	res2.on('end', function () {
        		if (err)
                    throw err;
                console.log(str);
            });
        }).on('error', function(e) {console.log("Got error: " + e.message); res.status(400).send();});

        post_req.end(); 
	});
}
