var express = require('express'),
    app = express(),
    path = require('path'),
    port = 9001;

// The root url
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/site/index.html'));
});

// The public files eg css, js and images.
app.use(express.static('site/public'));


// Listen
app.listen(port);
// Log that the site is running.
console.log('The server is running: http://localhost:'+port);


