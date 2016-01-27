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
                    res.status(200).send(JSON.stringify(result));
                    console.log(JSON.stringify(result)); 
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
                    res.status(200).send(JSON.stringify(result));
                    console.log(JSON.stringify(result)); 
                });  
            });
        }).on('error', function(e) {console.log("Got error: " + e.message); res.status(400).send();});

        post_req.end(); 
	});

    app.post('/api/scenario/fake', function(req, res) {
        console.log(req.body);
        var xml = "<?xml version='1.0' encoding='UTF-8' standalone='no'?><endTime>2300</endTime>"
        parseString(xml, function (err, result) {
            res.status(200).send(JSON.stringify(result));
            console.log(JSON.stringify(result)); 
        });  
    });

    app.get('/api/results/fake', function(req, res) {
        var xml = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\
<Intervals>\
    <Interval Number="0">\
        <Start>0</Start>\
        <End>1010</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>8.0</TotalMessages>\
            <ResponseTime>83.75</ResponseTime>\
        </Consumer>\
        <Consumer>\
            <Name>consumer79</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>1.0</TotalMessages>\
            <ResponseTime>473.0</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="1">\
        <Start>1010</Start>\
        <End>2020</End>\
        <Consumer>\
            <Name>consumer18</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>1.0</TotalMessages>\
            <ResponseTime>120.0</ResponseTime>\
        </Consumer>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>37.0</TotalMessages>\
            <ResponseTime>17.756752</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="2">\
        <Start>2020</Start>\
        <End>3030</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>45.0</TotalMessages>\
            <ResponseTime>16.66667</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="3">\
        <Start>3030</Start>\
        <End>4040</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>46.0</TotalMessages>\
            <ResponseTime>15.804346</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="4">\
        <Start>4040</Start>\
        <End>5050</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>48.0</TotalMessages>\
            <ResponseTime>29.708334</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="5">\
        <Start>5050</Start>\
        <End>6060</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>12.0</TotalMessages>\
            <ResponseTime>16.25</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="6">\
        <Start>6060</Start>\
        <End>7070</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>37.0</TotalMessages>\
            <ResponseTime>20.783783</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="7">\
        <Start>7070</Start>\
        <End>8080</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>49.0</TotalMessages>\
            <ResponseTime>15.163265</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="8">\
        <Start>8080</Start>\
        <End>9090</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>47.0</TotalMessages>\
            <ResponseTime>16.29787</ResponseTime>\
        </Consumer>\
    </Interval>\
    <Interval Number="9">\
        <Start>9090</Start>\
        <End>10101</End>\
        <Consumer>\
            <Name>consumer148</Name>\
            <LostRequests>0.0</LostRequests>\
            <TotalMessages>47.0</TotalMessages>\
            <ResponseTime>14.085107</ResponseTime>\
        </Consumer>\
    </Interval>\
</Intervals>';

        parseString(xml, function (err, result) {
            res.status(200).send(JSON.stringify(result));
            console.log(JSON.stringify(result)); 
        });  
        
    });
}