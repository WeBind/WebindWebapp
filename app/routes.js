var builder = require('xmlbuilder');
var parseString = require('xml2js').parseString;
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
            var str = "";
            res2.on('data', function (chunk) {
                str += chunk;
        	});

        	res2.on('end', function () {
                parseString(str, function (err, result) {
                    if(err)
                        throw err;
                    console.log(JSON.stringify(result));
                    res.status(200).send(JSON.stringify(result));
                });           
            });
        }).on('error', function(e) {console.log("Got error: " + e.message); res.status(400).send();});

        post_req.write(xmlString);
        post_req.end(); 

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
                parseString(str, function (err, result) {
                    if(err)
                        throw err;
                    console.log(JSON.stringify(result));
                    res.status(200).send(JSON.stringify(result));
                });
            });
        }).on('error', function(e) {console.log("Got error: " + e.message); res.status(400).send();});

        post_req.end(); 
	});

    app.post('/api/scenario/fake', function(req, res) {
        console.log(req.body);
        var xml = "<?xml version='1.0' encoding='UTF-8' standalone='no'?><endTime>10101</endTime>"
        parseString(xml, function (err, result) {
            if(err) {
                throw err;
                res.status(400).send();
            }
            console.log(JSON.stringify(result));
            res.status(200).send(JSON.stringify(result));
        });
    });

    app.get('/api/results/fake', function(req, res) {
        var xml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\
        <Intervals>\
            <Interval Number="0">\
                <Start>0</Start>\
                <End>130</End>\
            </Interval>\
            <Interval Number="1">\
                <Start>130</Start>\
                <End>260</End>\
                <Consumer Name="Consumer : consumer79">\
                    <LostRequests>0.0</LostRequests>\
                    <TotalMessages>1.0</TotalMessages>\
                    <ResponseTime>1995.0</ResponseTime>\
                </Consumer>\
            </Interval>\
            <Interval Number="2">\
                <Start>260</Start>\
                <End>390</End>\
            </Interval>\
            <Interval Number="3">\
                <Start>390</Start>\
                <End>520</End>\
            </Interval>\
            <Interval Number="4">\
                <Start>520</Start>\
                <End>650</End>\
            </Interval>\
            <Interval Number="5">\
                <Start>650</Start>\
                <End>780</End>\
            </Interval>\
            <Interval Number="6">\
                <Start>780</Start>\
                <End>910</End>\
            </Interval>\
            <Interval Number="7">\
                <Start>910</Start>\
                <End>1040</End>\
                <Consumer Name="Consumer : consumer18">\
                    <LostRequests>0.0</LostRequests>\
                    <TotalMessages>1.0</TotalMessages>\
                    <ResponseTime>1136.0</ResponseTime>\
                </Consumer>\
            </Interval>\
            <Interval Number="8">\
                <Start>1040</Start>\
                <End>1170</End>\
                <Consumer Name="Consumer : consumer148">\
                    <LostRequests>0.0</LostRequests>\
                    <TotalMessages>1.0</TotalMessages>\
                    <ResponseTime>1135.0</ResponseTime>\
                </Consumer>\
            </Interval>\
            <Interval Number="9">\
                <Start>1170</Start>\
                <End>1301</End>\
            </Interval>\
        </Intervals>';

        parseString(xml, function (err, result) {
            if(err) {
                throw err;
                res.status(400).send();
            }
            console.log(JSON.stringify(result));
            res.status(200).send(JSON.stringify(result));
        });
    });
}