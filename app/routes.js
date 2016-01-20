module.exports = function(app) {

	// error
	app.get('/error', function(req, res) {
	    res.send('Error');
	});

	// index
	app.get('/', function(req, res) {
	    res.sendfile('./views/index.html');
	});

}
