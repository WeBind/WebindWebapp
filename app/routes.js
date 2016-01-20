// home
app.get('/home', function(req, res) {
    res.sendfile('./views/home.html');
});

// error
app.get('/error', function(req, res) {
    res.send('Error');
});

// index
app.get('/', function(req, res) {
    res.sendfile('./views/index.html');
});

